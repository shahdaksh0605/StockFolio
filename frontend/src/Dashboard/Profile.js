import React, { useEffect, useState } from "react";
import { auth } from "../firebase/firebase";
import { signOut } from "firebase/auth";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import useStockPrices from "../useStockprice"; // adjust path if needed
import { Height } from "@mui/icons-material";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);

  const prices = useStockPrices(); // get live prices from your hook

  useEffect(() => {
    const fetchProfileAndHoldings = async () => {
      try {
        if (!auth.currentUser) {
          setLoading(false);
          return;
        }

        const firebaseUID = auth.currentUser.uid;

        // Fetch user profile
        const profileRes = await axios.get(
          `http://localhost:8000/stockfolio/profile?firebaseUID=${firebaseUID}`
        );
        setUserData(profileRes.data);

        // Fetch holdings
        const holdingsRes = await axios.get(
          `http://localhost:8000/stockfolio/getHoldings/${firebaseUID}`
        );
        setHoldings(holdingsRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndHoldings();
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
        No user data found
      </div>
    );
  }

  // Prepare pie chart data using live prices
  const labels = holdings.map(h => h.stockName);
  const values = holdings.map(h => {
    const livePrice = prices[h.stockName]?.price;
    return h.quantity * (livePrice || h.avg); // fallback to avg if no live price yet
  });

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: ["#4CAF50", "#FF9800", "#2196F3", "#F44336", "#9C27B0"],
        borderColor: "#fff",
        borderWidth: 2
      }
    ]
  };
  const chartOptions = {
  responsive: false,
  plugins: {
    legend: { position: "bottom" }
  }
};

  return (
    <div className="text-black p-6 bg-white">
      {/* Profile Card */}
      <div className=" shadow-lg rounded-xl p-6 max-w-md mx-auto mb-8 text-center">
        <FaUserCircle className="text-6xl text-gray-500 mx-auto mb-4" style={{fontSize:"45px"}}/>
        <h2 className="text-2xl font-bold mb-2">Your Profile</h2>
        <p><strong>Name:</strong> {userData.name}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Balance:</strong> ₹{Number(userData.balance).toLocaleString()}</p>
        <button
          onClick={handleLogout}
          className="btn btn-danger border rounded"
        >
          Logout
        </button>
      </div>

      {/* Pie Chart */}
      {holdings.length > 0 ? (
        <div className="mx-auto" style={{Height:"300px",width:"300px"}}>
          <h3 className="text-lg font-semibold text-center mb-4">Holdings Distribution</h3>
          <Pie data={chartData} />
        </div>
      ) : (
        <p className="text-center text-gray-500">No holdings found</p>
      )}
    </div>
  );
}
