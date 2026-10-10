
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Onboarding.css";

export default function Onboarding() {
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState(["Science"]);
  const [difficulty, setDifficulty] = useState("Beginner");
  const [learningStyle, setLearningStyle] = useState("Quiz");
  const [avatar, setAvatar] = useState("🧑‍🚀");

  const subjectOptions = [
    { name: "Science", icon: "🔬" },
    { name: "Mathematics", icon: "➗" },
    { name: "English", icon: "📚" },
    { name: "Coding", icon: "💻" },
  ];

  function toggleSubject(subject) {
    setSubjects((current) =>
      current.includes(subject)
        ? current.filter((item) => item !== subject)
        : [...current, subject]
    );
  }

  function startAdventure(e) {
    e.preventDefault();

    if (subjects.length === 0) {
      alert("Choose at least one subject!");
      return;
    }

    const user = JSON.parse(
      localStorage.getItem("learnlensUser") || "null"
    );

    if (!user) {
      navigate("/signup");
      return;
    }

    const updatedUser = {
      ...user,
      interests: subjects,
      difficulty,
      learningStyle,
      avatar,
      onboardingComplete: true,
    };

    localStorage.setItem("learnlensUser", JSON.stringify(updatedUser));
    navigate("/dashboard");
  }

  return (
    <main className="onboarding-page">
      <header className="onboarding-header">
        <Link to="/" className="onboarding-brand">🎮 LearnLens</Link>
        <span className="onboarding-step">PLAYER SETUP · 01/01</span>
      </header>

      <form className="onboarding-card" onSubmit={startAdventure}>
        <div className="onboarding-icon">🗺️</div>
        <p className="onboarding-kicker">YOUR JOURNEY STARTS HERE</p>
        <h1>Choose Your Learning Adventure!</h1>
        <p className="onboarding-description">
          Customize your player. Choose your world. Get ready to level up!
        </p>

        <section className="onboarding-section">
          <h2>🌎 1. Choose Your Worlds</h2>
          <p>Select every subject you want to explore.</p>
          <div className="onboarding-options">
            {subjectOptions.map((subject) => (
              <button
                type="button"
                key={subject.name}
                className={`onboarding-option ${
                  subjects.includes(subject.name) ? "selected" : ""
                }`}
                onClick={() => toggleSubject(subject.name)}
                aria-pressed={subjects.includes(subject.name)}
              >
                <span>{subject.icon}</span>
                {subject.name}
                {subjects.includes(subject.name) && <b>✓</b>}
              </button>
            ))}
          </div>
        </section>

        <section className="onboarding-section">
          <h2>⚔️ 2. Select Your Challenge</h2>
          <div className="onboarding-options">
            {["Beginner", "Intermediate", "Advanced"].map((level) => (
              <button
                type="button"
                key={level}
                className={`onboarding-option ${
                  difficulty === level ? "selected" : ""
                }`}
                onClick={() => setDifficulty(level)}
              >
                {level === "Beginner" ? "🌱" : level === "Intermediate" ? "🔥" : "👑"}
                {" "}{level}
              </button>
            ))}
          </div>
        </section>

        <section className="onboarding-section">
          <h2>🧠 3. Choose Your Learning Style</h2>
          <div className="onboarding-options">
            {[
              { name: "Visual", icon: "🎨" },
              { name: "Quiz", icon: "❓" },
              { name: "Video", icon: "🎬" },
            ].map((style) => (
              <button
                type="button"
                key={style.name}
                className={`onboarding-option ${
                  learningStyle === style.name ? "selected" : ""
                }`}
                onClick={() => setLearningStyle(style.name)}
              >
                {style.icon} {style.name}
              </button>
            ))}
          </div>
        </section>

        <section className="onboarding-section">
          <h2>🧑‍🚀 4. Pick Your Hero</h2>
          <div className="avatar-options">
            {["🧑‍🚀", "🦊", "🐼", "🐉", "🦄", "🤖"].map((item) => (
              <button
                type="button"
                key={item}
                className={`avatar-option ${avatar === item ? "selected" : ""}`}
                onClick={() => setAvatar(item)}
                aria-label={`Choose avatar ${item}`}
                aria-pressed={avatar === item}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        <button className="start-adventure" type="submit">
          🚀 Start My Adventure →
        </button>
        <p className="onboarding-footnote">
          ✨ Your choices personalize your learning experience.
        </p>
      </form>
    </main>
  );
}
