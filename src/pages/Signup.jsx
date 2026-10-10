
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Student");
  const [error, setError] = useState("");

  function handleSignup(e) {
    e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    const existing = JSON.parse(localStorage.getItem("learnlensUser") || "null");

    if (existing?.email === normalizedEmail) {
      setError("An account with this email already exists. Please log in.");
      return;
    }

    const user = {
      name: name.trim(),
      email: normalizedEmail,
      password,
      role,
      xp: 0,
      level: 1,
      coins: 0,
      streak: 0,
      badges: [],
      completedLessons: [],
      weakTopics: [],
      interests: [],
      difficulty: "Beginner",
      learningStyle: "Quiz"
    };

    localStorage.setItem("learnlensUser", JSON.stringify(user));
    localStorage.setItem("learnlensLoggedIn", "true");
    navigate("/onboarding");
  }

  return (
    <main className="auth-page">
      <Link to="/" className="auth-brand">✦ LearnLens</Link>

      <form className="auth-card" onSubmit={handleSignup}>
        <span className="auth-tag">✨ JOIN THE ADVENTURE</span>
        <h1>Create your hero</h1>
        <p className="auth-subtitle">One account. A world of discovery.</p>

        {error && <div className="auth-error">{error}</div>}

        <label>Player name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          minLength={2}
          required
        />

        <label>Email address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />

        <label>Password (at least 8 characters)</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          placeholder="Create a password"
          required
        />

        <label>Choose your role</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option>Student</option>
          <option>Teacher</option>
          <option>Parent</option>
        </select>

        <button className="auth-submit" type="submit">Create Account →</button>

        <p className="auth-switch">
          Already registered? <Link to="/login">Log in</Link>
        </p>
        <Link className="auth-back" to="/">← Back to home</Link>
      </form>
    </main>
  );
}
