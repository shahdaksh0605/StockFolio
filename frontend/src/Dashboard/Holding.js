import React from "react";
import { holdings } from "../data/data";

const Holdings = () => {
  return (
    <>
      <h3 className="mb-4">Holdings ({holdings.length})</h3>
      <div className="table-responsive mb-4">
        <table className="table table-bordered align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg. cost</th>
              <th>LTP</th>
              <th>Cur. val</th>
              <th>P&L</th>
              <th>Net chg.</th>
              <th>Day chg.</th>
            </tr>
            {
              holdings.map((stock,index)=>{
                const curValue = stock.qty * stock.price;
                const isProfit = curValue - stock.avg * stock.qty>=0.0
                const profitClass = isProfit ? "text-success" : "text-danger"
                const dayClass = stock.isLoss ? "text-danger" : "text-success"

                return(<tr key={index}>
                  <td >{stock.name}</td>
                  <td >{stock.qty}</td>
                  <td >{stock.avg.toFixed(2)}</td>
                  <td >{stock.price.toFixed(2)}</td>
                  <td >{curValue.toFixed(2)}</td>
                  <td className={profitClass}>{(curValue-stock.avg*stock.qty).toFixed(2)}</td>
                  <td className={profitClass}>{stock.net}</td>
                  <td className={dayClass}>{stock.day}</td>
                </tr>)
              })
            }
          </thead>
        </table>
      </div>
      <div className="row text-center">
        <div className="col">
          <h5 className="mb-1">
            29,875.<span>55</span>
          </h5>
          <p className="text-muted mb-0">Total investment</p>
        </div>
        <div className="col">
          <h5 className="mb-1">
            31,428.<span>95</span>
          </h5>
          <p className="text-muted mb-0">Current value</p>
        </div>
        <div className="col">
          <h5 className="mb-1">1,553.40 (+5.20%)</h5>
          <p className="text-muted mb-0">P&L</p>
        </div>
      </div>
    </>
  );
};

export default Holdings;