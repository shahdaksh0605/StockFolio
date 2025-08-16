// src/useAlerts.js
import { useEffect, useState, useCallback } from "react";
import socket from "../socket";
import axios from "axios";
import { useAuth } from "../context/authcontext/index";

const useAlerts = () => {
  const { currentUser } = useAuth();
  const [alerts, setAlerts] = useState([]);

  // live push from Flask
  useEffect(() => {
    const handler = (payload) => {
      if (!currentUser?.uid) return;
      if (payload?.userId) {
        // We only care about alerts for this user; backend puts Mongo _id, not firebaseUID,
        // so we can't match here; we'll still display but rely on REST fetch for persistence.
        setAlerts((prev) => [payload, ...prev]);
      }
    };
    socket.on("prediction_alert", handler);
    return () => socket.off("prediction_alert", handler);
  }, [currentUser]);

  // pull persisted alerts from Node (maps firebaseUID → user → alerts)
  const refresh = useCallback(async () => {
    if (!currentUser?.uid) return;
    const { data } = await axios.get(`http://localhost:8000/stockfolio/alerts/${currentUser.uid}`);
    setAlerts(data || []);
  }, [currentUser]);

  // mark read
  const markRead = useCallback(async (id) => {
    await axios.post(`http://localhost:8000/stockfolio/alerts/${id}/read`);
    setAlerts((prev) => prev.map((a) => (a._id === id ? { ...a, read: true } : a)));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { alerts, refresh, markRead };
};

export default useAlerts;
