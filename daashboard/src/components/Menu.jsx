import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";

const Menu = () => {
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [username, setUsername] = useState("USERID");
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/me`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && data.user) {
          const firstName = String(data.user.name || "").trim().split(" ")[0] || "USER";
          setUsername(firstName);
          setUser(data.user);
        }
      })
      .catch(() => {
        // ignore errors and keep default
      });
  }, []);

  const handleMenuClick = (index) => {
    setSelectedMenu(index);
  };

  const handleProfileClick = (index) => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const menuClass = "menu";
  const activeMenuClass = "menu selected";

  return (
    <div className="menu-container">
      <img src="logo.png" style={{ width: "40px" }} />
      <div className="menus">
        <ul>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/"
              onClick={() => handleMenuClick(0)}
            >
              <p className={selectedMenu === 0 ? activeMenuClass : menuClass}>
                Dashboard
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/orders"
              onClick={() => handleMenuClick(1)}
            >
              <p className={selectedMenu === 1 ? activeMenuClass : menuClass}>
                Orders
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/holdings"
              onClick={() => handleMenuClick(2)}
            >
              <p className={selectedMenu === 2 ? activeMenuClass : menuClass}>
                Holdings
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/positions"
              onClick={() => handleMenuClick(3)}
            >
              <p className={selectedMenu === 3 ? activeMenuClass : menuClass}>
                Positions
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="funds"
              onClick={() => handleMenuClick(4)}
            >
              <p className={selectedMenu === 4 ? activeMenuClass : menuClass}>
                Funds
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/apps"
              onClick={() => handleMenuClick(6)}
            >
              <p className={selectedMenu === 6 ? activeMenuClass : menuClass}>
                Apps
              </p>
            </Link>
          </li>
        </ul>
        <hr />
        <div className="profile" onClick={handleProfileClick}>
          <div className="avatar">{(username || "U").slice(0,2).toUpperCase()}</div>
          <p className="username">{username}</p>
        </div>

        {/* Profile dropdown */}
        {isProfileDropdownOpen && (
          <div className="profile-dropdown">
            <p className="pd-name">{user ? user.name : username}</p>
            <p className="pd-email">{user ? user.email : ""}</p>
            <p className="pd-mobile">{user ? user.mobile : ""}</p>
            <hr />
            <button
              className="btn btn-link logout-btn"
              onClick={async () => {
                try {
                  const res = await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
                    method: "POST",
                    credentials: "include",
                  });
                  // ignore body; on success redirect
                  window.location.replace(import.meta.env.VITE_FRONTEND_URL);
                } catch (err) {
                  console.error("Logout failed", err);
                  window.location.replace(import.meta.env.VITE_FRONTEND_URL);
                }
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
