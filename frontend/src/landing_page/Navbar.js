import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <img src="images/StockFolio.png" alt="" style={{width:"30%",marginLeft:"90px"}}/>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mb-2 mb-lg-0" style={{marginLeft:"250px"}}>
              <li className="nav-item fs-5 fw-semibold mx-2">
                <Link className="nav-link" to="/signup">
                  Signup
                </Link>
              </li>
              <li className="nav-item fs-5 fw-semibold mx-2">
                <Link className="nav-link" to="/about">
                  About
                </Link>
              </li>
              <li className="nav-item fs-5 fw-semibold mx-2">
                <Link className="nav-link" to="/pricing">
                  Pricing
                </Link>
              </li>
              <li className="nav-item fs-5 fw-semibold mx-2">
                <Link className="nav-link" to="/support">
                  Support
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
  );
}
