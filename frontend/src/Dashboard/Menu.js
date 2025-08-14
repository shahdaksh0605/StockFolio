import React from "react";
import { Link } from "react-router-dom";

const Menu = () => {
  return (
    <div className="d-flex flex-row align-items-center p-3 bg-white rounded shadow-sm w-75">
      <nav className="navbar navbar-expand-lg bg-body-tertiary shadow-sm">
      <div className="container-fluid px-4">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img
            src="/images/StockFolio.png"
            alt="StockFolio"
            style={{ height: "40px", marginRight: "670px" }}
          />
        </Link>

        {/* Toggler button for small screens */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible navbar content */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link fs-5 fw-semibold" to="/Dashboard">
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fs-5 fw-semibold" to="/Dashboard/orders">
                Orders
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fs-5 fw-semibold" to="/Dashboard/Holdings">
                Holdings
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fs-5 fw-semibold" to="/Dashboard/funds">
                Funds
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fs-5 fw-semibold" to="/Dashboard/apps">
                App
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    </div>
  );
};

export default Menu;