import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
  });

  // Redirect authenticated users away from OTP page
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/me`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) window.location.replace(import.meta.env.VITE_DASHBOARD_URL);
      })
      .catch(() => {});
  }, []);

  // Prefill email from navigation state or sessionStorage; if none, redirect to signup
  useEffect(() => {
    const navEmail = location && location.state && location.state.email;
    const stored = typeof window !== "undefined" ? sessionStorage.getItem("pendingVerificationEmail") : null;

    const initialEmail = navEmail || stored || "";
    if (!initialEmail) {
      // No context for OTP verification — redirect to signup
      navigate("/signup", { replace: true });
      return;
    }

    setFormData((prev) => ({ ...prev, email: initialEmail }));
  }, [location, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.status === 403) {
        window.location.replace(import.meta.env.VITE_DASHBOARD_URL);
        return;
      }

      if (data.success) {
        // Clear pending email and continue to login
        try { sessionStorage.removeItem("pendingVerificationEmail"); } catch (err) {}

        alert("OTP verified successfully");
        navigate("/login");
      } else {
        alert(data.message || "Invalid OTP");
      }
    } catch (error) {
      console.error("OTP verification failed", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="container">
      <div className="row mt-5">
        <div className="col">
          <img src="media/images/page-otp.svg" alt="OTP" />
        </div>

        <div className="col">
          <h3>Enter OTP</h3>

          <form onSubmit={handleSubmit}>
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <label>Email address</label>
            </div>

            <div className="form-floating">
              <input
                type="text"
                className="form-control"
                placeholder="Enter OTP"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                required
              />
              <label>OTP</label>
            </div>

            <button type="submit" className="btn btn-primary mt-3">
              Verify OTP
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default VerifyOtp;
