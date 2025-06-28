import React from "react";

export default function Navbar() {
  return (
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <img src="images/StockFolio.png" alt="" style={{width:"30%",marginLeft:"90px"}}/>
          </a>
          <button
            className="navbar-toggler"
            type="button"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mb-2 mb-lg-0" style={{marginLeft:"250px"}}>
              <li className="nav-item fs-5 fw-semibold mx-2">
                <a className="nav-link" href="#">
                  Signup
                </a>
              </li>
              <li className="nav-item fs-5 fw-semibold mx-2">
                <a className="nav-link" href="#">
                  About
                </a>
              </li>
              <li className="nav-item fs-5 fw-semibold mx-2">
                <a className="nav-link">
                  Products
                </a>
              </li>
              <li className="nav-item fs-5 fw-semibold mx-2">
                <a className="nav-link">
                  Pricing
                </a>
              </li>
              <li className="nav-item fs-5 fw-semibold mx-2">
                <a className="nav-link">
                  Support
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
  );
}
