// App.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";

function App() {
  const [authState, setAuthState] = useState("checking"); 
  // checking | authenticated | unauthenticated

  useEffect(() => {
    let isMounted = true;

    fetch(`${import.meta.env.VITE_API_URL}/me`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data && data.success) {
          setAuthState("authenticated");
        } else {
          setAuthState("unauthenticated");
        }
      })
      .catch(() => {
        if (isMounted) setAuthState("unauthenticated");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // 🔄 Still checking
  if (authState === "checking") {
    return <h2>Checking authentication...</h2>;
  }

  // ❌ Not logged in → redirect ONCE
  if (authState === "unauthenticated") {
    window.location.replace(
      `${import.meta.env.VITE_FRONTEND_URL}/login`
    );
    return null;
  }

  // ✅ Logged in
  return (
    <Routes>
      <Route path="/*" element={<Home />} />
    </Routes>
  );
}

export default App;
