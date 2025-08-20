// src/useAlerts.js
import { useEffect, useState, useCallback } from "react";
import socket from "../socket";
import axios from "axios";
import { useAuth } from "../context/authcontext/index";

const useAlerts = () => {
  const { currentUser } = useAuth();
  const [alerts, setAlerts] = useState([]); // Only one state for the filtered alerts

  // live push from Flask
  useEffect(() => {
    const handler = (payload) => {
      if (!currentUser?.uid || !payload?.userId) return;

      // Only add the new alert if it's a "fall" decision
      if (payload.decision === "fall") {
        setAlerts((prev) => [payload, ...prev]);
      }
    };
    socket.on("prediction_alert", handler);
    return () => socket.off("prediction_alert", handler);
  }, [currentUser]);

  // pull persisted alerts from Node and filter them
  const refresh = useCallback(async () => {
    if (!currentUser?.uid) return;
    try {
      const { data } = await axios.get(`http://localhost:8000/stockfolio/alerts/${currentUser.uid}`);
      if (data) {
        const fallAlerts = data.filter(a => a.decision === 'fall');
        setAlerts(fallAlerts);
      } else {
        setAlerts([]);
      }
    } catch (error) {
      console.error("Failed to fetch alerts:", error);
      setAlerts([]);
    }
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