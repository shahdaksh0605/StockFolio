import React, { useState, useEffect } from "react";
import socket from "../socket"; // adjust path if needed
import Menu from "./Menu";

const TopBar = () => {
  const [nifty, setNifty] = useState(null);
  const [sensex, setSensex] = useState(null);

  useEffect(() => {
    const handleStockUpdate = (data) => {
      if (data.symbol === "^NSEI") {
        setNifty(data.price);
      } else if (data.symbol === "^BSESN") {
        setSensex(data.price);
      }
    };

    socket.on("stock_update", handleStockUpdate);

    return () => {
      socket.off("stock_update", handleStockUpdate);
    };
  }, []);

  return (
    <div className="container-fluid py-2 bg-light border-bottom">
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex gap-4">
          <div className="d-flex flex-column align-items-start">
            <p className="mb-0 fw-bold">NIFTY 50</p>
            <p className="mb-0 text-primary">
              {nifty !== null ? nifty : "Loading..."}
            </p>
          </div>
          <div className="d-flex flex-column align-items-start">
            <p className="mb-0 fw-bold">SENSEX</p>
            <p className="mb-0 text-primary">
              {sensex !== null ? sensex : "Loading..."}
            </p>
          </div>
        </div>
        <Menu />
      </div>
    </div>
  );
};

export default TopBar;
