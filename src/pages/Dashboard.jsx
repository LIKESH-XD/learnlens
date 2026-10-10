import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

// Correct answers are kept on the frontend for this demo.
// The backend sends the questions and options, but not the answers.
const answerKey = {
  1: 1, // Mars
  2: 2, // Root
  3: 1, // Sun
};

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("learnlensUser") || "{}");
    } catch {
      return {};
    }
  });

  const [activeTab, setActiveTab] = useState("Overview");
  const [xp, setXp] = useState(Number(user.xp) || 0);
  const [coins, setCoins] = useState(Number(user.coins) || 0);
  const [streak] = useState(Number(user.streak) || 0);

  // Backend quiz states
  const [questions, setQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [questionsError, setQuestionsError] = useState("");

  // Quiz states
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [savingProgress, setSavingProgress] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const name = user.name || "Little Builder";
  const firstName = name.split(" ")[0];

  // Load quiz questions from the backend
  useEffect(() => {
    let cancelled = false;

    async function loadQuestions() {
      setQuestionsLoading(true);
      setQuestionsError("");

      try {
        const response = await fetch(
          "http://localhost:5000/api/questions"
        );

        if (!response.ok) {
          throw new Error("Could not load quiz questions.");
        }

        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
          throw new Error("No quiz questions are available.");
        }

        if (!cancelled) {
          setQuestions(data);
        }
      } catch (error) {
        if (!cancelled) {
          setQuestionsError(
            "Could not connect to the quiz server. Make sure your backend is running on port 5000."
          );
        }
      } finally {
        if (!cancelled) {
          setQuestionsLoading(false);
        }
      }
    }

    loadQuestions();

    return () => {
      cancelled = true;
    };
  }, []);

  // Save the latest user details locally
  function saveProgress(newXp, newCoins) {
    const updatedUser = {
      ...user,
      xp: newXp,
      coins: newCoins,
    };

    setUser(updatedUser);
    localStorage.setItem("learnlensUser", JSON.stringify(updatedUser));
  }

  // Select an answer
  function chooseAnswer(index) {
    if (answer !== null || quizFinished) return;

    const currentQuestion = questions[questionIndex];
    if (!currentQuestion) return;

    setAnswer(index);

    if (index === answerKey[currentQuestion.id]) {
      const newXp = xp + 20;
      const newCoins = coins + 5;

      setXp(newXp);
      setCoins(newCoins);
      setScore((previousScore) => previousScore + 1);

      saveProgress(newXp, newCoins);
    }
  }

  // Save completed quiz results to the backend
  async function saveQuizResults(finalScore) {
    setSavingProgress(true);
    setSaveMessage("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/progress",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentName: name,
            score: finalScore,
            totalQuestions: questions.length,
            xpEarned: finalScore * 20,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Could not save quiz results.");
      }

      setSaveMessage("Your quiz progress was saved successfully!");
    } catch (error) {
      console.error("Progress save failed:", error);
      setSaveMessage(
        "Quiz completed, but progress could not be saved. Check your backend."
      );
    } finally {
      setSavingProgress(false);
    }
  }

  // Move to the next question or finish the quiz
  function nextQuestion() {
    if (answer === null || savingProgress) return;

    if (questionIndex === questions.length - 1) {
      setQuizFinished(true);

      // Calculate the score including the last answer immediately.
      const finalScore =
        score +
        (answer === answerKey[questions[questionIndex].id] ? 0 : 0);

      saveQuizResults(finalScore);
    } else {
      setQuestionIndex((previousIndex) => previousIndex + 1);
      setAnswer(null);
    }
  }

  // Restart the quiz without removing previously earned XP
  function restartQuiz() {
    setQuestionIndex(0);
    setAnswer(null);
    setScore(0);
    setQuizFinished(false);
    setSaveMessage("");
  }

  function handleLogout() {
    localStorage.removeItem("learnlensLoggedIn");
    navigate("/login");
  }

  const menuItems = [
    { name: "Overview", icon: "🏡" },
    { name: "My Learning", icon: "📚" },
    { name: "Achievements", icon: "🏆" },
    { name: "Leaderboard", icon: "🌟" },
  ];

  // Loading screen
  if (questionsLoading) {
    return (
      <div className="ll-page">
        <div className="ll-main">
          <div className="ll-card">
            <h2>🧱 Preparing your adventure...</h2>
            <p>Loading your learning questions. Please wait!</p>
          </div>
        </div>
      </div>
    );
  }

  // Error screen
  if (questionsError) {
    return (
      <div className="ll-page">
        <div className="ll-main">
          <div className="ll-card">
            <h2>Oops! We couldn't load your adventure.</h2>
            <p>{questionsError}</p>
            <button
              className="ll-primary-btn"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="ll-page">
        <div className="ll-main">
          <div className="ll-card">
            <h2>No questions found.</h2>
            <p>Please check your backend question list.</p>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[questionIndex];
  const correctAnswer = answerKey[currentQuestion.id];

  return (
    <div className="ll-page">
      {/* Sidebar */}
      <aside className="ll-sidebar">
        <div className="ll-brand">
          <span className="ll-brand-icon">🧱</span>
          <div>
            <h2>LearnLens</h2>
            <p>Block Adventure</p>
          </div>
        </div>

        <div className="ll-profile">
          <div className="ll-avatar">
            {user.avatar || "🧑‍🚀"}
          </div>
          <div>
            <h3>{name}</h3>
            <p>Level {Math.floor(xp / 100) + 1} Explorer</p>
          </div>
        </div>

        <nav className="ll-menu">
          {menuItems.map((item) => (
            <button
              key={item.name}
              className={`ll-menu-item ${
                activeTab === item.name ? "active" : ""
              }`}
              onClick={() => setActiveTab(item.name)}
            >
              <span>{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>

        <div className="ll-sidebar-bottom">
          <p>Keep exploring, keep growing! 🌱</p>
          <button
            className="ll-menu-item"
            onClick={handleLogout}
          >
            <span>🚪</span>
            Log Out
          </button>
        </div>
      </aside>

      {/* Main dashboard */}
      <main className="ll-main">
        <header className="ll-topbar">
          <div>
            <p className="ll-eyebrow">YOUR LEARNING WORLD</p>
            <h1>
              Hey, {firstName}! <span>👋</span>
            </h1>
            <p>Ready to discover something amazing today?</p>
          </div>

          <div className="ll-topbar-stats">
            <div className="ll-mini-stat">
              <span>⭐</span>
              <strong>{xp} XP</strong>
            </div>
            <div className="ll-mini-stat">
              <span>🪙</span>
              <strong>{coins}</strong>
            </div>
          </div>
        </header>

        {/* Overview */}
        {activeTab === "Overview" && (
          <>
            <section className="ll-welcome-card">
              <div>
                <p className="ll-eyebrow">WELCOME TO BLOCK ADVENTURE</p>
                <h2>Your next big discovery starts here!</h2>
                <p>
                  Solve fun questions, earn rewards, and build your
                  knowledge one block at a time.
                </p>
                <button
                  className="ll-primary-btn"
                  onClick={() => {
                    setActiveTab("My Learning");
                    setAnswer(null);
                    setQuestionIndex(0);
                    setScore(0);
                    setQuizFinished(false);
                    setSaveMessage("");
                  }}
                >
                  Start Learning 🚀
                </button>
              </div>
              <div className="ll-welcome-art">🏰</div>
            </section>

            <section className="ll-stats-grid">
              <div className="ll-stat-card">
                <span className="ll-stat-icon">⭐</span>
                <p>Total XP</p>
                <h2>{xp}</h2>
                <small>Keep earning rewards!</small>
              </div>

              <div className="ll-stat-card">
                <span className="ll-stat-icon">🪙</span>
                <p>Adventure Coins</p>
                <h2>{coins}</h2>
                <small>Coins from correct answers</small>
              </div>

              <div className="ll-stat-card">
                <span className="ll-stat-icon">🔥</span>
                <p>Learning Streak</p>
                <h2>{streak} days</h2>
                <small>Build your daily habit</small>
              </div>

              <div className="ll-stat-card">
                <span className="ll-stat-icon">🏆</span>
                <p>Quiz Score</p>
                <h2>
                  {score}/{questions.length}
                </h2>
                <small>Current quiz progress</small>
              </div>
            </section>

            <section className="ll-section-heading">
              <div>
                <h2>Today's Adventure 🗺️</h2>
                <p>Choose a learning activity to explore.</p>
              </div>
            </section>

            <section className="ll-activity-grid">
              <button
                className="ll-activity-card"
                onClick={() => setActiveTab("My Learning")}
              >
                <span>🔬</span>
                <h3>Science Quest</h3>
                <p>Answer questions and discover cool facts.</p>
                <strong>Play now →</strong>
              </button>

              <button
                className="ll-activity-card"
                onClick={() => setActiveTab("Achievements")}
              >
                <span>🏅</span>
                <h3>My Achievements</h3>
                <p>See your progress and celebrate your learning.</p>
                <strong>View rewards →</strong>
              </button>

              <button
                className="ll-activity-card"
                onClick={() => setActiveTab("Leaderboard")}
              >
                <span>🌈</span>
                <h3>Adventure Journey</h3>
                <p>Keep earning XP as you learn something new.</p>
                <strong>Explore →</strong>
              </button>
            </section>
          </>
        )}

        {/* Learning quiz */}
        {activeTab === "My Learning" && (
          <section className="ll-learning-section">
            <div className="ll-section-heading">
              <div>
                <p className="ll-eyebrow">SCIENCE WORLD 🔬</p>
                <h2>Your Science Quest</h2>
                <p>Choose the correct answer to earn 20 XP and 5 coins.</p>
              </div>
            </div>

            <div className="ll-quiz-card">
              {!quizFinished ? (
                <>
                  <div className="ll-quiz-top">
                    <span>
                      Question {questionIndex + 1} of {questions.length}
                    </span>
                    <span>⭐ {xp} XP</span>
                  </div>

                  <div className="ll-progress-track">
                    <div
                      className="ll-progress-fill"
                      style={{
                        width: `${
                          ((questionIndex + 1) / questions.length) * 100
                        }%`,
                      }}
                    />
                  </div>

                  <p className="ll-subject-tag">
                    {currentQuestion.subject || "Adventure Question"}
                  </p>

                  <h2 className="ll-question">
                    {currentQuestion.question}
                  </h2>

                  <div className="ll-options-grid">
                    {currentQuestion.options.map((option, index) => {
                      const isCorrect =
                        answer !== null && index === correctAnswer;

                      const isWrongSelected =
                        answer === index && index !== correctAnswer;

                      let optionClass = "ll-option";

                      if (answer !== null && isCorrect) {
                        optionClass += " correct";
                      } else if (isWrongSelected) {
                        optionClass += " incorrect";
                      }

                      return (
                        <button
                          key={`${currentQuestion.id}-${option}`}
                          className={optionClass}
                          onClick={() => chooseAnswer(index)}
                          disabled={answer !== null}
                        >
                          <span className="ll-option-letter">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span>{option}</span>
                          {answer !== null && isCorrect && (
                            <span className="ll-option-result">✓</span>
                          )}
                          {isWrongSelected && (
                            <span className="ll-option-result">✕</span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {answer !== null && (
                    <div className="ll-answer-feedback">
                      <h3>
                        {answer === correctAnswer
                          ? "🎉 Correct! You earned 20 XP."
                          : "💡 Good try! Keep learning."}
                      </h3>
                      <p>{currentQuestion.fact}</p>
                    </div>
                  )}

                  <button
                    className="ll-primary-btn ll-next-btn"
                    onClick={nextQuestion}
                    disabled={answer === null || savingProgress}
                  >
                    {questionIndex === questions.length - 1
                      ? "Finish Quiz 🏆"
                      : "Next Question →"}
                  </button>
                </>
              ) : (
                <div className="ll-quiz-results">
                  <div className="ll-results-icon">🎉</div>
                  <h2>Adventure Completed!</h2>
                  <p>Awesome work, {firstName}! You finished your quiz.</p>

                  <div className="ll-results-stats">
                    <div>
                      <span>🏆</span>
                      <strong>
                        {score}/{questions.length}
                      </strong>
                      <small>Correct answers</small>
                    </div>

                    <div>
                      <span>⭐</span>
                      <strong>+{score * 20} XP</strong>
                      <small>XP earned this quiz</small>
                    </div>
                  </div>

                  {savingProgress && <p>Saving your results...</p>}

                  {saveMessage && (
                    <p className="ll-save-message">{saveMessage}</p>
                  )}

                  <button
                    className="ll-primary-btn"
                    onClick={restartQuiz}
                    disabled={savingProgress}
                  >
                    Play Again 🔄
                  </button>

                  <button
                    className="ll-secondary-btn"
                    onClick={() => setActiveTab("Overview")}
                  >
                    Back to Dashboard
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Achievements */}
        {activeTab === "Achievements" && (
          <section className="ll-learning-section">
            <div className="ll-section-heading">
              <div>
                <h2>Your Achievements 🏆</h2>
                <p>Every small step is a big achievement.</p>
              </div>
            </div>

            <div className="ll-achievements-grid">
              <div className="ll-achievement-card">
                <span>🌱</span>
                <h3>First Steps</h3>
                <p>Start your learning adventure.</p>
                <strong>Unlocked</strong>
              </div>

              <div className="ll-achievement-card">
                <span>⭐</span>
                <h3>XP Explorer</h3>
                <p>Earn 100 experience points.</p>
                <strong>{xp >= 100 ? "Unlocked!" : `${xp}/100 XP`}</strong>
              </div>

              <div className="ll-achievement-card">
                <span>🧠</span>
                <h3>Science Star</h3>
                <p>Answer three questions correctly in one quiz.</p>
                <strong>
                  {quizFinished && score === 3 ? "Unlocked!" : "Keep learning"}
                </strong>
              </div>
            </div>
          </section>
        )}

        {/* Leaderboard demo */}
        {activeTab === "Leaderboard" && (
          <section className="ll-learning-section">
            <div className="ll-section-heading">
              <div>
                <h2>Explorer Leaderboard 🌟</h2>
                <p>A sample leaderboard for the LearnLens demo.</p>
              </div>
            </div>

            <div className="ll-leaderboard">
              {[
                { rank: "🥇", student: "Sky Builder", points: 320 },
                { rank: "🥈", student: "Star Explorer", points: 250 },
                { rank: "🥉", student: "Pixel Wizard", points: 180 },
                { rank: "🎮", student: name, points: xp },
              ]
                .sort((a, b) => b.points - a.points)
                .map((player, index) => (
                  <div
                    className="ll-leaderboard-row"
                    key={player.student}
                  >
                    <span>{index + 1}.</span>
                    <span>{player.rank}</span>
                    <strong>{player.student}</strong>
                    <span>{player.points} XP</span>
                  </div>
                ))}
            </div>

            <p className="ll-demo-note">
              Note: Other explorer scores are sample data for demonstration.
            </p>
          </section>
        )}

        <footer className="ll-footer">
          <p>🧱 LearnLens — Discover. Decode. Master.</p>
          <p>Every question is a new adventure! 🌈</p>
        </footer>
      </main>
    </div>
  );
}