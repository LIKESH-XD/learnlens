import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./App.css";

const worlds = [
  {
    id: "math",
    name: "Math Blocklands",
    emoji: "🔢",
    color: "math",
    detail: "Solve number puzzles and discover hidden treasures.",
  },
  {
    id: "science",
    name: "Crystal Caves",
    emoji: "💎",
    color: "science",
    detail: "Explore crystals, space, nature, and science.",
  },
  {
    id: "language",
    name: "Storybook Village",
    emoji: "📚",
    color: "language",
    detail: "Unlock stories, words, grammar, and creative quests.",
  },
  {
    id: "eco",
    name: "Green Pixel Valley",
    emoji: "🌳",
    color: "eco",
    detail: "Protect wildlife and build a greener world.",
  },
];
const scienceQuestions = [
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    answer: 1,
    fact: "Mars looks reddish because its surface contains iron oxide."
  },
  {
    question: "Which part of a plant absorbs water?",
    options: ["Flower", "Leaf", "Root", "Fruit"],
    answer: 2,
    fact: "Roots absorb water and minerals from the soil."
  },
  {
    question: "What is the main source of energy for Earth?",
    options: ["Moon", "Sun", "Wind", "Stars"],
    answer: 1,
    fact: "The Sun provides most of the energy that supports life on Earth."
  }
];


function App() {
  const [page, setPage] = useState("home");
  const [selectedWorld, setSelectedWorld] = useState(null);
  const [xp, setXp] = useState(0);
  const [questDone, setQuestDone] = useState(false);
  const [studentName, setStudentName] = useState("Little Builder");
  const [nameInput, setNameInput] = useState("");
  const [showNameForm, setShowNameForm] = useState(false);

  // Science quiz states
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const level = Math.floor(xp / 100) + 1;
  const levelXp = xp % 100;


  function startAdventure() {
  window.location.href = "/signup";
}

  function finishQuest() {
    if (!questDone) {
      setXp((current) => current + 50);
      setQuestDone(true);
    }
  }
  
function answerQuestion(index) {
  if (selectedAnswer !== null || quizFinished) return;

  setSelectedAnswer(index);

  if (index === scienceQuestions[quizIndex].answer) {
    setQuizScore((score) => score + 1);
    setXp((current) => current + 20);
  }
}

function nextQuestion() {
  if (quizIndex === scienceQuestions.length - 1) {
    setQuizFinished(true);
  } else {
    setQuizIndex((current) => current + 1);
  }

  setSelectedAnswer(null);
}

function restartQuiz() {
  setQuizIndex(0);
  setSelectedAnswer(null);
  setQuizScore(0);
  setQuizFinished(false);
}


  function openWorld(world) {
    setSelectedWorld(world);
    setPage("dashboard");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="game-app">
      <header className="topbar">
        <button className="logo" onClick={() => setPage("home")}>
          <span className="logo-dragon">🐲</span>
          Learn<span>Lens</span>
        </button>

        <nav className="navigation">
          <button
            className={page === "home" ? "nav-active" : ""}
            onClick={() => setPage("home")}
          >
            Home
          </button>
          <button
            className={page === "dashboard" ? "nav-active" : ""}
            onClick={startAdventure}
          >
            Adventure
          </button>
          <button
            onClick={() =>
              document
                .getElementById("features")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Worlds
          </button>
        </nav>

               <div className="auth-buttons">
          <Link to="/login" className="auth-nav-btn signin-btn">
            Sign In
          </Link>
          <Link to="/signup" className="auth-nav-btn signup-btn">
            Sign Up 🚀
          </Link>
        </div>
      </header>

      {page === "home" ? (
        <main>
          <section className="hero">
            <div className="hero-copy">
              <span className="pill">🧱 WELCOME TO BLOCK ADVENTURE</span>

              <h1>
                Build. Explore.
                <br />
                <span>Learn Block by Block!</span>
              </h1>

              <p>
                Jump into a pastel pixel world! Solve clever puzzles,
                explore floating islands, collect treasure, and learn
                amazing things along the way.
              </p>

              <div className="hero-buttons">
                <button className="primary-btn" onClick={startAdventure}>
                  🚀 Start Your Journey <span>→</span>
                </button>

                <button
                  className="secondary-btn"
                  onClick={() =>
                    document
                      .getElementById("features")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Explore the Worlds
                </button>
              </div>

              <div className="mini-stats">
                <div>
                  <strong>🗺️ 4</strong>
                  <span>Pixel Worlds</span>
                </div>
                <div>
                  <strong>💎 XP</strong>
                  <span>Collect Rewards</span>
                </div>
                <div>
                  <strong>🐲 Draco</strong>
                  <span>Your Block Buddy</span>
                </div>
              </div>
            </div>

            <div className="hero-scene">
              <div className="sun">☀️</div>
              <div className="cloud cloud-one">☁️</div>
              <div className="cloud cloud-two">☁️</div>

              <div className="floating-island island-back">
                <div className="pixel-castle">🏯</div>
                <div className="castle-ground" />
              </div>

              <div className="rainbow">🌈</div>

              <div className="hero-dragon">🐲</div>

              <div className="speech-bubble">
                Hey, builder!
                <br />
                Ready to craft? ✨
              </div>

              <div className="floating-island island-front">
                <div className="grass-blocks">
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
                <div className="front-trees">
                  🌳　🌼　🌳
                </div>
              </div>

              <div className="scene-label">Your next quest awaits!</div>
              <div className="sparkle sparkle-one">✦</div>
              <div className="sparkle sparkle-two">✧</div>
            </div>
          </section>

          <section className="feature-section" id="features">
            <div className="section-intro">
              <span className="pill">🎮 CHOOSE YOUR ADVENTURE</span>
              <h2>
                Four worlds.
                <span> Endless discoveries!</span>
              </h2>
              <p>Every block holds a new secret to discover.</p>
            </div>

            <div className="world-grid">
              {worlds.map((world) => (
                <button
                  className={`world-card ${world.color}`}
                  key={world.id}
                  onClick={() => openWorld(world)}
                >
                  <span className="world-emoji">{world.emoji}</span>
                  <span className="world-title">{world.name}</span>
                  <span className="world-description">{world.detail}</span>
                  <span className="world-link">Enter world →</span>
                </button>
              ))}
            </div>
          </section>

          <section className="callout">
            <div className="callout-copy">
              <span className="pill">🐲 MEET YOUR BLOCK BUDDY</span>
              <h2>
                Small steps.
                <br />
                <span>Legendary discoveries.</span>
              </h2>
              <p>
                Draco is ready to cheer you on as you explore, learn,
                and collect rewards.
              </p>
            </div>

            <div className="callout-dragon">🐲</div>

            <button className="primary-btn" onClick={startAdventure}>
              Enter My World →
            </button>
          </section>
        </main>
      ) : (
        <main className="dashboard">
          <div className="welcome-row">
            <div>
              <span className="pill">🧱 YOUR BLOCK ADVENTURE</span>
              <h1>
  Hey, {studentName}! <span>{studentAvatar}</span>
</h1>
              <p>Your next quest is waiting. Let's level up!</p>
            </div>

            <div className="dragon-buddy">
              <span>🐲</span>
              <div>
                <strong>Draco</strong>
                <small>Your pixel companion</small>
              </div>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card purple">
              <span>💎</span>
              <div>
                <small>Total XP</small>
                <strong>{xp}</strong>
              </div>
            </div>

            <div className="stat-card yellow">
              <span>👑</span>
              <div>
                <small>Player Level</small>
                <strong>{level}</strong>
              </div>
            </div>

            <div className="stat-card pink">
              <span>🔥</span>
              <div>
                <small>Daily Streak</small>
                <strong>1 day</strong>
              </div>
            </div>

            <div className="stat-card green">
              <span>🏅</span>
              <div>
                <small>Badges</small>
                <strong>{questDone ? 1 : 0}</strong>
              </div>
            </div>
          </div>

          <section className="level-panel">
            <div className="level-top">
              <strong>⚡ Level {level} progress</strong>
              <span>{levelXp}/100 XP</span>
            </div>

            <div className="level-track">
              <div style={{ width: `${levelXp}%` }} />
            </div>

            <small>
              {100 - levelXp} more XP to reach the next level!
            </small>
          </section>

          <div className="dashboard-layout">
            <section className="world-panel">
              <div className="panel-heading">
                <div>
                  <h2>🗺️ Block World Map</h2>
                  <p>Pick an island and explore</p>
                </div>
                <span>4 WORLDS</span>
              </div>

              <div className="map-scene">
                <div className="map-sun">☀️</div>
                <div className="map-cloud">☁️</div>

                {worlds.map((world, index) => (
                  <button
                    key={world.id}
                    className={`map-island island-${index + 1}`}
                    onClick={() => setSelectedWorld(world)}
                  >
                    <span>{world.emoji}</span>
                    <strong>{world.name}</strong>
                    <small>Explore →</small>
                  </button>
                ))}

                <span className="map-path path-one">〰️</span>
                <span className="map-path path-two">〰️</span>
                <span className="map-dragon">🐲</span>
                <span className="map-gem gem-one">💎</span>
                <span className="map-gem gem-two">✨</span>
              </div>

              {selectedWorld && (
                <div className="selected-world">
                  <button
                    className="close-small"
                    onClick={() => setSelectedWorld(null)}
                    aria-label="Close world details"
                  >
                    ✕
                  </button>
                  <span className="world-emoji">{selectedWorld.emoji}</span>
                  <div>
                    <strong>{selectedWorld.name}</strong>
                    <p>{selectedWorld.detail}</p>
                    <small>
                      World selected! Interactive lessons are our next build.
                    </small>
                  </div>
                </div>
              )}
            </section>

            <aside className="quest-panel">
              <div className="panel-heading">
                <div>
                  <h2>🎯 Daily Quest</h2>
                  <p>Your mission for today</p>
                </div>
                <span>+50 XP</span>
              </div>

              <div className="quest-art">{questDone ? "🏆" : "🧰"}</div>

              <h3>
                {questDone ? "Treasure discovered!" : "The Lost Treasure Block"}
              </h3>

              <p>
                {questDone
                  ? "Fantastic work! Your treasure chest is full of XP."
                  : "Begin your adventure and claim your first treasure reward."}
              </p>

              <div className="quest-progress">
                <span style={{ width: questDone ? "100%" : "0%" }} />
              </div>

              <button
                className="primary-btn quest-button"
                onClick={finishQuest}
                disabled={questDone}
              >
                {questDone ? "✅ Treasure Collected" : "Open Treasure +50 XP"}
              </button>

              {!questDone && (
                <small className="quest-note">
                  A one-time reward for this session.
                </small>
              )}
            </aside>
          </div>
          
<section
  style={{
    margin: "30px 0",
    padding: "28px",
    borderRadius: "24px",
    background: "linear-gradient(135deg, #f0e9ff, #e2f6ff)",
    color: "#352b55",
  }}
>
  <span className="pill">🧠 LEARNLENS CHALLENGE</span>
  <h2 style={{ marginTop: "16px" }}>🔬 Science Quest</h2>

  {quizFinished ? (
    <div>
      <h3>🏆 Quest Completed!</h3>
      <p>You scored {quizScore} out of {scienceQuestions.length}.</p>
      <button className="primary-btn" onClick={restartQuiz}>
        🔄 Play Again
      </button>
    </div>
  ) : (
    <div>
      <p>Question {quizIndex + 1} of {scienceQuestions.length}</p>
      <h3>{scienceQuestions[quizIndex].question}</h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "12px",
          marginTop: "20px",
        }}
      >
        {scienceQuestions[quizIndex].options.map((option, index) => {
          const correct =
            selectedAnswer !== null &&
            index === scienceQuestions[quizIndex].answer;
          const wrong =
            selectedAnswer === index && !correct;

          return (
            <button
              key={option}
              disabled={selectedAnswer !== null}
              onClick={() => answerQuestion(index)}
              style={{
                padding: "16px",
                borderRadius: "14px",
                border: "2px solid",
                borderColor: correct ? "#2ca66f" : wrong ? "#e56b79" : "#d8cafa",
                background: correct ? "#d9f8e7" : wrong ? "#ffe2e5" : "#fff",
                color: "#352b55",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              {correct ? "✅ " : wrong ? "❌ " : ""}
              {option}
            </button>
          );
        })}
      </div>

      {selectedAnswer !== null && (
        <div style={{ marginTop: "20px" }}>
          <p>
            {selectedAnswer === scienceQuestions[quizIndex].answer
              ? "🎉 Correct! You earned 20 XP!"
              : "💡 Not quite! Learn the correct answer above."}
          </p>
          <p>{scienceQuestions[quizIndex].fact}</p>
          <button className="primary-btn" onClick={nextQuestion}>
            {quizIndex === scienceQuestions.length - 1
              ? "🏆 See My Results"
              : "Next Question →"}
          </button>
        </div>
      )}
    </div>
  )}
</section>


          <section className="quick-section">
            <div className="panel-heading">
              <div>
                <h2>⚡ Quick Adventures</h2>
                <p>Choose what you want to explore</p>
              </div>
            </div>

            <div className="quick-grid">
              <button onClick={() => setSelectedWorld(worlds[0])}>
                🔢
                <strong>Math Puzzles</strong>
                <small>Train your brain!</small>
              </button>

              <button onClick={() => setSelectedWorld(worlds[1])}>
                💎
                <strong>Crystal Quest</strong>
                <small>Discover science!</small>
              </button>

              <button onClick={() => setShowNameForm(true)}>
                🧑‍🚀
                <strong>My Player</strong>
                <small>Change your name</small>
              </button>

              <button onClick={() => setPage("home")}>
                🏡
                <strong>Home Island</strong>
                <small>Return to home</small>
              </button>
            </div>
          </section>
        </main>
      )}

      <footer className="footer">
        <button className="logo" onClick={() => setPage("home")}>
          🐲 Learn<span>Lens</span>
        </button>
        <p>Build your knowledge, one block at a time ✨</p>
        <span>A colorful learning adventure for ages 10–14</span>
      </footer>

      {showNameForm && (
        <div
          className="modal-backdrop"
          onClick={() => setShowNameForm(false)}
        >
          <form
            className="name-modal"
            onSubmit={(event) => {
              event.preventDefault();

              if (nameInput.trim()) {
                setStudentName(nameInput.trim().slice(0, 24));
              }

              setNameInput("");
              setShowNameForm(false);
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="close-small"
              onClick={() => setShowNameForm(false)}
              aria-label="Close profile"
            >
              ✕
            </button>

            <div className="modal-dragon">🐲</div>
            <h2>Choose your builder name</h2>
            <p>Your adventure, your identity!</p>

            <input
              value={nameInput}
              onChange={(event) => setNameInput(event.target.value)}
              placeholder="Your explorer name"
              maxLength={24}
              autoFocus
            />

            <button className="primary-btn" type="submit">
              Save My Name ✨
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;