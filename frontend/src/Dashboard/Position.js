import React from "react";
import { positions } from "../data/data";

const Positions = () => {
  return (
    <>
      <h3 className="mb-4">Positions ({positions.length})</h3>
      <div className="table-responsive mb-4">
        <table className="table table-bordered align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>Product</th>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg.</th>
              <th>LTP</th>
              <th>P&L</th>
              <th>Chg.</th>
            </tr>
          </thead>
          {
              positions.map((stock,index)=>{
                const curValue = stock.qty * stock.price;
                const isProfit = curValue - stock.avg * stock.qty>=0.0
                const profitClass = isProfit ? "text-success" : "text-danger"
                const dayClass = stock.isLoss ? "text-danger" : "text-success"

                return(<tr key={index}>
                  <td>{stock.product}</td>
                  <td >{stock.name}</td>
                  <td >{stock.qty}</td>
                  <td >{stock.avg.toFixed(2)}</td>
                  <td >{stock.price. toFixed(2)}</td>
                  <td className={profitClass}>{(curValue-stock.avg*stock.qty).toFixed(2)}</td>
                  <td className={dayClass}>{stock.day}</td>
                </tr>)
              })
            }
        </table>
      </div>
    </>
  );
};

export default Positions;