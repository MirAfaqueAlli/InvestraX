import React, { useState, useEffect } from "react";
import axios from "axios";
import { VerticalChart } from "./VerticalChart";

const Holdings = () => {
  const [allHoldings, setAllHoldings] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/holdings`, {
        withCredentials: true,
      })
      .then((res) => {
        setAllHoldings(res.data.holdings || []);
      })
      .catch((err) => {
        console.error("Failed to fetch holdings", err);
      });
  }, []);

  // 🔢 CALCULATIONS
  let totalInvestment = 0;
  let currentValue = 0;

  allHoldings.forEach((h) => {
    totalInvestment += h.qty * h.avg;
    currentValue += h.qty * h.price;
  });

  const pnl = currentValue - totalInvestment;
  const pnlPercent =
    totalInvestment > 0 ? ((pnl / totalInvestment) * 100).toFixed(2) : "0.00";

  const labels = allHoldings.map((h) => h.name);

  const data = {
    labels,
    datasets: [
      {
        label: "Stock Price",
        data: allHoldings.map((h) => h.price),
        backgroundColor: "rgba(255,99,132,0.5)",
      },
    ],
  };

  return (
    <>
      <h3 className="title">Holdings ({allHoldings.length})</h3>

      <div className="order-table">
        <table>
          <thead>
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
          </thead>
          <tbody>
            {allHoldings.map((stock, index) => {
              const curVal = stock.price * stock.qty;
              const stockPnl = curVal - stock.avg * stock.qty;
              const profClass = stockPnl >= 0 ? "profit" : "loss";

              return (
                <tr key={index}>
                  <td>{stock.name}</td>
                  <td>{stock.qty}</td>
                  <td>{stock.avg.toFixed(2)}</td>
                  <td>{stock.price.toFixed(2)}</td>
                  <td>{curVal.toFixed(2)}</td>
                  <td className={profClass}>{stockPnl.toFixed(2)}</td>
                  <td className={profClass}>{stock.net ?? "-"}</td>
                  <td>-</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 🔽 SUMMARY FIXED */}
      <div className="row">
        <div className="col">
          <h5>{totalInvestment.toLocaleString()}</h5>
          <p>Total investment</p>
        </div>
        <div className="col">
          <h5>{currentValue.toLocaleString()}</h5>
          <p>Current value</p>
        </div>
        <div className="col">
          <h5 className={pnl >= 0 ? "profit" : "loss"}>
            {pnl.toLocaleString()} ({pnlPercent}%)
          </h5>
          <p>P&amp;L</p>
        </div>
      </div>

      <VerticalChart data={data} />
    </>
  );
};

export default Holdings;
