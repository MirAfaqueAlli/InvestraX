import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function NavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/me`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.success) setIsLoggedIn(true);
        else setIsLoggedIn(false);
      })
      .catch(() => setIsLoggedIn(false));
  }, []);

  const handleDashboardClick = (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      navigate("/login");
    } else {
      window.location.href = import.meta.env.VITE_DASHBOARD_URL;
    }
  };

  return (
    <nav className="navbar navbar-expand-lg border-bottom" style={{ backgroundColor: "#FFF" }}>
      <div className="container p-2">
        <Link className="navbar-brand" to="/">
          <img src="media/images/logo.svg" style={{ width: "25%" }} alt="logo" />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">

            {/* DASHBOARD */}
            <li className="nav-item">
              <a className="nav-link active" href="/" onClick={handleDashboardClick}>
                Dashboard
              </a>
            </li>

            <li className="nav-item">
              <Link className="nav-link active" to="/about">About</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" to="/product">Product</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" to="/pricing">Pricing</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" to="/support">Support</Link>
            </li>

            {/* AUTH BUTTONS */}
            {!isLoggedIn && (
              <>
                <li className="nav-item">
                  <Link className="nav-link active" to="/signup">Signup</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link active" to="/login">Login</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
