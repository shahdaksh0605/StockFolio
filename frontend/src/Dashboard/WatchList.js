import React from "react";

const WatchList = () => {
  return (
    <div className="container p-3 bg-light rounded w-50  m-0">
      <div className="input-group">
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search eg:infy, bse, nifty fut weekly, gold mcx"
          className="form-control "
        />
        <span className="input-group-text bg-white border-0 text-muted">9 / 50</span>
      </div>
    </div>
  );
};

export default WatchList;