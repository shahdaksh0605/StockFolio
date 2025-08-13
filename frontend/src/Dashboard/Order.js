import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/authcontext/index"; // adjust path

const Orders = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.uid) return;

    axios
      .get(`http://localhost:8000/stockfolio/getOrders/${currentUser.uid}`)
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        setLoading(false);
      });
  }, [currentUser]);

  if (loading) return <p className="text-center mt-4">Loading orders...</p>;

  if (orders.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
        <div className="card p-4 text-center bg-light border-0 shadow-sm">
          <p className="mb-3 text-muted">You haven't placed any orders yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h3>Your Orders</h3>
      <table className="table table-striped table-hover mt-3">
        <thead className="table-dark">
          <tr>
            <th>Symbol</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Mode</th>
            <th>Status</th>
            <th>Placed At</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order.symbol}</td>
              <td>{order.qty}</td>
              <td>₹{order.price}</td>
              <td>{order.mode}</td>
              <td>
                {order.status === "pending" ? (
                  <span className="badge bg-warning text-dark">Pending</span>
                ) : (
                  <span className="badge bg-success">Executed</span>
                )}
              </td>
              <td>{new Date(order.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
