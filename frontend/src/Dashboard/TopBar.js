import React from "react";

import Menu from "./Menu";

const TopBar = () => {
  return (
    <div className="container-fluid py-2 bg-light border-bottom">
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex gap-4">
          <div className="d-flex flex-column align-items-start">
            <p className="mb-0 fw-bold">NIFTY 50</p>
            <p className="mb-0 text-primary">{100.2}</p>
            <p className="mb-0 text-muted small"></p>
          </div>
          <div className="d-flex flex-column align-items-start">
            <p className="mb-0 fw-bold">SENSEX</p>
            <p className="mb-0 text-primary">{100.2}</p>
            <p className="mb-0 text-muted small"></p>
          </div>
        </div>
        <Menu />
      </div>
    </div>
  );
};

export default TopBar;