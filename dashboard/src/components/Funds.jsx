import React from "react";
import { Link } from "react-router-dom";

const Funds = () => {
  const [summary, setSummary] = React.useState(null);

  React.useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/dashboard/summary`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success) setSummary(data.summary);
        else setSummary({});
      })
      .catch(() => setSummary({}));
  }, []);

  return (
    <>
      <div className="funds">
        <p>Instant, zero-cost fund transfers with UPI </p>
        <Link className="btn btn-green">Add funds</Link>
        <Link className="btn btn-blue">Withdraw</Link>
      </div>

      <div className="row">
        <div className="col">
          <span>
            <p>Equity</p>
          </span>

          <div className="table">
            <div className="data">
              <p>Available margin</p>
              <p className="imp colored">{summary?.availableMargin?.toLocaleString() ?? "-"}</p>
            </div>
            <div className="data">
              <p>Used margin</p>
              <p className="imp">{summary?.usedMargin ?? 0}</p>
            </div>
            <div className="data">
              <p>Available cash</p>
              <p className="imp">{summary?.availableMargin?.toLocaleString() ?? "-"}</p>
            </div>
            <hr />
            <div className="data">
              <p>Opening Balance</p>
              <p>{summary?.openingBalance ?? "-"}</p>
            </div>
            <div className="data">
              <p>Payin</p>
              <p>0.00</p>
            </div>
            <div className="data">
              <p>SPAN</p>
              <p>0.00</p>
            </div>
            <div className="data">
              <p>Delivery margin</p>
              <p>0.00</p>
            </div>
            <div className="data">
              <p>Exposure</p>
              <p>0.00</p>
            </div>
            <div className="data">
              <p>Options premium</p>
              <p>0.00</p>
            </div>
            <hr />
            <div className="data">
              <p>Collateral (Liquid funds)</p>
              <p>0.00</p>
            </div>
            <div className="data">
              <p>Collateral (Equity)</p>
              <p>0.00</p>
            </div>
            <div className="data">
              <p>Total Collateral</p>
              <p>0.00</p>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="commodity">
            <p>You don't have a commodity account</p>
            <Link className="btn btn-blue">Open Account</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Funds;
