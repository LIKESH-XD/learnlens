
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function handleLogin(e) {
    e.preventDefault();
    setError("");

    let savedUser;

    try {
      savedUser = JSON.parse(
        localStorage.getItem("learnlensUser") || "null"
      );
    } catch {
      setError("Your saved account could not be read. Please sign up again.");
      return;
    }

    if (
      !savedUser ||
      savedUser.email !== email.trim().toLowerCase() ||
      savedUser.password !== password
    ) {
      setError("Player not found! Check your details or create an account.");
      return;
    }

    localStorage.setItem("learnlensLoggedIn", "true");
    navigate("/dashboard");
  }

  return (
    <main className="auth-page">
      <Link to="/" className="auth-brand">
        🎮 LearnLens
      </Link>

      <form className="auth-card" onSubmit={handleLogin}>
        <span className="auth-tag">✨ PLAYER PORTAL · LEVEL UP</span>

        <div className="login-avatar">🧑‍🚀</div>

        <h1>Welcome Back, Player!</h1>

        <p className="auth-subtitle">
          Your next adventure is waiting. Ready to level up?
        </p>

        {error && (
          <div className="auth-error" role="alert">
            ⚠️ {error}
          </div>
        )}

        <label htmlFor="login-email">Email address</label>
        <input
          id="login-email"
          type="email"
          placeholder="player@example.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="login-password">Password</label>

        <div className="password-field">
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        <button className="auth-submit" type="submit">
          🚀 Enter the Game →
        </button>

        <p className="auth-switch">
          New explorer? <Link to="/signup">Create an account</Link>
        </p>

        <Link className="auth-back" to="/">
          ← Back to home
        </Link>
      </form>

      <p className="login-footer">
        🌟 Every expert was once a beginner.
      </p>
    </main>
  );
}
