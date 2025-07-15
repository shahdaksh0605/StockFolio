import React from "react";
import { Link } from "react-router-dom";

const Orders = () => {
  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
      <div className="card p-4 text-center bg-light border-0 shadow-sm">
        <p className="mb-3 text-muted">You haven't placed any orders today</p>
        <Link to={"/"} className="btn btn-primary">
          Get started
        </Link>
      </div>
    </div>
  );
};

export default Orders;