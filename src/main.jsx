import Onboarding from "./pages/Onboarding.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./App.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import "./index.css";

function ProtectedRoute({ children }) {
  const loggedIn = localStorage.getItem("learnlensLoggedIn") === "true";
  return loggedIn ? children : <Navigate to="/login" replace />;
}

<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>

function OnboardingPlaceholder() {
  return (
    <main style={{ color: "white", background: "#090b14", minHeight: "100vh", padding: 40 }}>
      <h1>🗺️ Choose your learning adventure!</h1>
      <p>Your signup worked! We'll build the subject and difficulty selection next.</p>
      <button onClick={() => window.location.href = "/dashboard"}>Continue to dashboard</button>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
  path="/onboarding"
  element={
    <ProtectedRoute>
      <Onboarding />
    </ProtectedRoute>
  }
/>
        <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
