import React from "react";

const Summary = () => {
  return (
    <div className="p-3 bg-white rounded shadow-sm w-100 h-100">
      <div className="mb-3">
        <h6 className="mb-1">Hi, User!</h6>
        <hr className="my-2" />
      </div>

      <div className="mb-4">
        <span>
          <p className="mb-2 fw-bold">Equity</p>
        </span>
        <div className="p-3 bg-light rounded">
          <div className="mb-2">
            <h3 className="mb-1">3.74k</h3>
            <p className="mb-0 text-muted">Margin available</p>
          </div>
          <hr className="my-2" />
          <div className="d-flex flex-column gap-1">
            <p className="mb-0">
              Margins used <span className="fw-bold">0</span>
            </p>
            <p className="mb-0">
              Opening balance <span className="fw-bold">3.74k</span>
            </p>
          </div>
        </div>
        <hr className="my-3" />
      </div>

      <div className="mb-4">
        <span>
          <p className="mb-2 fw-bold">Holdings (13)</p>
        </span>
        <div className="p-3 bg-light rounded">
          <div className="mb-2">
            <h3 className="mb-1 text-success">
              1.55k <small className="text-success">+5.20%</small>
            </h3>
            <p className="mb-0 text-muted">P&L</p>
          </div>
          <hr className="my-2" />
          <div className="d-flex flex-column gap-1">
            <p className="mb-0">
              Current Value <span className="fw-bold">31.43k</span>
            </p>
            <p className="mb-0">
              Investment <span className="fw-bold">29.88k</span>
            </p>
          </div>
        </div>
        <hr className="my-3" />
      </div>
    </div>
  );
};

export default Summary;