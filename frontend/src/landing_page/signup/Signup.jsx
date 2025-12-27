import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  // Redirect authenticated users away from signup page
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/me`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) window.location.replace(import.meta.env.VITE_DASHBOARD_URL);
      })
      .catch(() => {});
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    pan: "",
    dob: "",
  });

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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      // If user is already authenticated, redirect to dashboard
      if (response.status === 403) {
        window.location.replace(import.meta.env.VITE_DASHBOARD_URL);
        return;
      }

      console.log("Signup response:", data);

      if (response.ok) {
        alert("OTP sent to your email");

        // persist pending verification email and pass it to OTP page
        try {
          sessionStorage.setItem("pendingVerificationEmail", formData.email);
        } catch (err) {
          /* ignore storage errors */
        }

        navigate("/verify-otp", {
          state: { email: formData.email },
        });
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Something went wrong. Try again.");
    }
  };

  return (
    <div className="container">
      <div className="row text-center mt-5">
        <h3 className="mb-4">
          Open a free demat and trading account online
        </h3>
        <p className="text-muted">
          Start investing brokerage free and join a community of 1.6+ crore
          investors and traders
        </p>
      </div>

      <div className="row mt-5">
        <div className="col">
          <img src="media/images/account_open.svg" alt="signup" />
        </div>

        <div className="col mt-3">
          <form className="row g-3" onSubmit={handleSubmit}>
            <div className="col-12">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Kalvin Clarke"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="row mt-3">
              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Phone Number</label>
                <div className="input-group">
                  <span className="input-group-text">+91</span>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="Phone number"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="col-12">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter your password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="row mt-3">
              <div className="col-md-6">
                <label className="form-label">PAN Number</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="ABCDE1234F"
                  name="pan"
                  value={formData.pan}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Date of Birth</label>
                <input
                  type="date"
                  className="form-control"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="col-12">
              <button type="submit" className="btn btn-primary">
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
