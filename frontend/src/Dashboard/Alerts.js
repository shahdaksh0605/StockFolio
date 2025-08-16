// src/components/Alerts.jsx
import React from "react";
import useAlerts from "./useAlerts";

const Badge = ({ decision }) => (
  <span className={`badge ${decision === "fall" ? "bg-danger" : "bg-secondary"}`}>
    {decision === "fall" ? "Likely Fall" : "Neutral/Rise"}
  </span>
);

const Alerts = () => {
  const { alerts, markRead } = useAlerts();

  if (!alerts?.length) return <div className="alert alert-light">No alerts yet.</div>;

  return (
    <div className="mb-4">
      <h5 className="mb-3">Alerts</h5>
      <div className="list-group">
        {alerts.map((a, idx) => {
          const id = a._id || `${a.symbol}-${idx}`;
          return (
            <div key={id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{a.symbol}</strong> &nbsp;<Badge decision={a.decision} />
                <div className="small text-muted">
                  Now: {a.now} &nbsp;→&nbsp; Pred: {a.predicted} ({a.predicted_change_pct}%)
                </div>
              </div>
              {"read" in a ? (
                a.read ? <span className="text-success small">read</span> :
                <button className="btn btn-sm btn-outline-primary" onClick={() => markRead(a._id)}>Mark read</button>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Alerts;
