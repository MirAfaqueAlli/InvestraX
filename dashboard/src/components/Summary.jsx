import React, { useEffect, useState } from "react";

const Summary = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/dashboard/summary`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success) setSummary(data.summary);
        else setSummary({});
      })
      .catch(() => setSummary({}));
  }, []);

  if (!summary) return <div>Loading summary...</div>;

  return (
    <>
      <div className="username">
        <h6>Hi, User!</h6>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Equity</p>
        </span>

        <div className="data">
          <div className="first">
            <h3>{summary.availableMargin?.toLocaleString() ?? "-"}</h3>
            <p>Margin available</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Margins used <span>{summary.usedMargin ?? 0}</span>
            </p>
            <p>
              Opening balance <span>{summary.openingBalance ?? "-"}</span>
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Holdings ({summary.holdingsCount ?? 0})</p>
        </span>

        <div className="data">
          <div className="first">
            <h3 className={summary.pnl >= 0 ? "profit" : "loss"}>
              {summary.pnl?.toLocaleString() ?? "-"} <small>{summary.pnl && summary.investment ? ("(" + ((summary.pnl / (summary.investment || 1)) * 100).toFixed(2) + "%)") : ""}</small>
            </h3>
            <p>P&L</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Current Value <span>{summary.currentValue?.toLocaleString() ?? "-"}</span>
            </p>
            <p>
              Investment <span>{summary.investment?.toLocaleString() ?? "-"}</span>
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>
    </>
  );
};

export default Summary;
