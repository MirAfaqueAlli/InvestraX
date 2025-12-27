import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // 🔐 Block already logged-in users
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/me`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          window.location.replace(import.meta.env.VITE_DASHBOARD_URL);
        }
      })
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.status === 403) {
        // Already authenticated on server
        window.location.replace(import.meta.env.VITE_DASHBOARD_URL);
        return;
      }

      if (data.success) {
        alert("Login successful");
        window.location.replace(import.meta.env.VITE_DASHBOARD_URL);
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="container">
      <div className="row mt-5">
        <div className="col">
          <img src="media/images/login.svg" alt="login" />
        </div>

        <div className="col mt-5">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email address</label>
              <input
                type="email"
                className="form-control"
                placeholder="name@example.com"
                name="email"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-floating">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                name="password"
                onChange={handleChange}
                required
              />
              <label>Password</label>
            </div>

            <button className="btn btn-primary mt-3">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
