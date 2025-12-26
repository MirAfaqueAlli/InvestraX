// App.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/me`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          // ❌ Not logged in → go back to frontend login
          window.location.replace(
            import.meta.env.VITE_FRONTEND_URL + "/login"
          );
        } else {
          // ✅ Logged in → allow dashboard
          setLoading(false);
        }
      })
      .catch(() => {
        window.location.replace(
          import.meta.env.VITE_FRONTEND_URL + "/login"
        );
      });
  }, []);

  if (loading) {
    return <h2>Checking authentication...</h2>;
  }

  return (
    <Routes>
      <Route path="/*" element={<Home />} />
    </Routes>
  );
}

export default App;
