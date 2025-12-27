import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/orders`, { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success) setOrders(data.orders);
        else setOrders([]);
      })
      .catch(() => setOrders([]));
  }, []);

  if (orders === null) return <div className="orders">Loading...</div>;

  if (!orders || orders.length === 0) {
    return (
      <div className="orders">
        <div className="no-orders">
          <p>You haven't placed any orders today</p>

          <Link to={"/"} className="btn">
            Get started
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="orders">
      <h4>Your recent orders</h4>
      <div className="order-table">
        <table >
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Qty</th>
            <th>Mode</th>
            <th>Price</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id}>
              <td>{o.name}</td>
              <td>{o.qty}</td>
              <td>{o.mode}</td>
              <td>{o.executedPrice || o.price}</td>
              <td>{o.status}</td>
              <td>{new Date(o.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default Orders;
