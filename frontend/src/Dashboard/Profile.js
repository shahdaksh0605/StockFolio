import React, { useEffect, useState } from "react";
import { auth } from "../firebase/firebase";
import { signOut } from "firebase/auth";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa"; // Font Awesome-style icon

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data from backend
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!auth.currentUser) {
          setLoading(false);
          return;
        }

        const firebaseUID = auth.currentUser.uid;
        const res = await axios.get(
          `http://localhost:8000/stockfolio/profile?firebaseUID=${firebaseUID}`
        );

        setUserData(res.data);
      } catch (err) {
        console.error("Error fetching user profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white text-black">
        Loading profile...
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-screen bg-white text-gray-500">
        No user data found.
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white text-black px-4">
      <div className="w-full max-w-md bg-white border border-gray-300 shadow-lg rounded-2xl p-8 text-center">
        {/* User Icon */}
        <div className="flex justify-center mb-4">
          <FaUserCircle className="text-gray-700 text-6xl" />
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold mb-6">Your Profile</h2>

        {/* Info */}
        <div className="space-y-4 text-left">
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold text-gray-600">Name:</span>
            <span>{userData.name}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold text-gray-600">Email:</span>
            <span>{userData.email}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold text-gray-600">Balance:</span>
            <span>₹{userData.balance.toLocaleString()}</span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
