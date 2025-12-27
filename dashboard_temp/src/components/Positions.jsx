import React, { useState, useEffect } from "react";
import axios from "axios";

const Positions = () => {
  const [allPositions, setAllPositions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/positions`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data && res.data.success) {
          setAllPositions(res.data.positions);
        } else {
          setAllPositions([]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch positions", err);
        setAllPositions([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <h3>Loading positions...</h3>;

  return (
    <>
      <h3 className="title">Positions ({allPositions.length})</h3>

      <div className="order-table">
        <table>
          <thead>
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
          <tbody>
            {allPositions.map((stock, index) => {
              const curVal = stock.price * stock.qty;
              const pnl = curVal - stock.avg * stock.qty;
              const isProfit = pnl >= 0;

              return (
                <tr key={index}>
                  <td>{stock.product}</td>
                  <td>{stock.name}</td>
                  <td>{stock.qty}</td>
                  <td>{stock.avg.toFixed(2)}</td>
                  <td>{stock.price.toFixed(2)}</td>
                  <td className={isProfit ? "profit" : "loss"}>
                    {pnl.toFixed(2)}
                  </td>
                  <td className={stock.isLoss ? "loss" : "profit"}>
                    {stock.day || "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Positions;
