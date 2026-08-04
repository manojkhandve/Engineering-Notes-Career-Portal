import React, { useState } from "react";
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Brain,
  Loader2,
  AlertCircle,
  Trophy,
  Target,
  BookOpen,
} from "lucide-react";

// ── constants ────────────────────────────────────────────────────────────────

const TOPICS = [
  { key: "Percentage",         emoji: "📊", desc: "Percent calculations, increase/decrease, comparisons" },
  { key: "Profit & Loss",      emoji: "💰", desc: "Cost price, selling price, discounts, markups" },
  { key: "Time & Work",        emoji: "⏱️",  desc: "Work rates, pipes & cisterns, efficiency" },
  { key: "Ratio & Proportion", emoji: "⚖️",  desc: "Ratios, direct & inverse proportion, mixtures" },
  { key: "Simple Interest",    emoji: "🏦", desc: "Principal, rate, time, interest calculations" },
  { key: "Speed & Distance",   emoji: "🚀", desc: "Relative speed, trains, boats and streams" },
];

const DIFFICULTY = [
  { key: "Easy",   color: "text-green-600 bg-green-50 border-green-200" },
  { key: "Medium", color: "text-amber-600 bg-amber-50 border-amber-200" },
  { key: "Hard",   color: "text-red-600 bg-red-50 border-red-200" },
];

const QUESTION_COUNTS = [5, 10, 15];

// ── API call ─────────────────────────────────────────────────────────────────

async function generateQuestions(topic, difficulty, count) {
  const prompt = `Generate exactly ${count} multiple choice questions on the topic "${topic}" at "${difficulty}" difficulty level for competitive exam preparation (like CAT, GMAT, placement tests).

Return ONLY a valid JSON array with no extra text, no markdown, no backticks. Each object must have:
- "question": string (the full question text, include numbers/values)
- "options": array of exactly 4 strings (labeled A, B, C, D — include the label in the string, e.g. "A. 25%")
- "answer": string (must exactly match one of the options strings, e.g. "A. 25%")
- "explanation": string (brief step-by-step solution, 2-3 sentences)

Example format:
[{"question":"...","options":["A. 10","B. 20","C. 30","D. 40"],"answer":"B. 20","explanation":"..."}]

Topic: ${topic}
Difficulty: ${difficulty}
Count: ${count}`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await response.json();
  const raw = data.content.map((b) => b.text || "").join("");
  const clean = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

// ── sub-components ────────────────────────────────────────────────────────────

function ProgressBar({ current, total, answers }) {
  return (
    <div className="flex gap-1 mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
            i === current
              ? "bg-blue-500"
              : answers[i]
              ? "bg-blue-200"
              : "bg-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

function ScoreBadge({ score, total }) {
  const pct = Math.round((score / total) * 100);
  const color =
    pct >= 70 ? "text-green-600" : pct >= 40 ? "text-amber-600" : "text-red-600";
  const bg =
    pct >= 70 ? "bg-green-50 border-green-200" : pct >= 40 ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200";
  return (
    <div className={`inline-flex flex-col items-center px-8 py-5 rounded-2xl border ${bg}`}>
      <span className={`text-5xl font-bold ${color}`}>{pct}%</span>
      <span className="text-sm text-gray-500 mt-1">{score} / {total} correct</span>
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────

const QuantAI = () => {
  // screens: "select" | "loading" | "quiz" | "result"
  const [screen, setScreen]         = useState("select");
  const [topic, setTopic]           = useState(null);
  const [difficulty, setDifficulty] = useState("Medium");
  const [count, setCount]           = useState(10);
  const [questions, setQuestions]   = useState([]);
  const [current, setCurrent]       = useState(0);
  const [answers, setAnswers]       = useState({});
  const [error, setError]           = useState("");
  const [score, setScore]           = useState(0);
  const [reviewFilter, setReviewFilter] = useState("all"); // all | correct | wrong

  // ── handlers ────────────────────────────────────────────────────────────────

  const startQuiz = async () => {
    if (!topic) return;
    setScreen("loading");
    setError("");
    try {
      const qs = await generateQuestions(topic.key, difficulty, count);
      setQuestions(qs);
      setAnswers({});
      setCurrent(0);
      setScreen("quiz");
    } catch (e) {
      setError("Failed to generate questions. Please try again.");
      setScreen("select");
    }
  };

  const handleOption = (option) => {
    setAnswers((prev) => ({ ...prev, [current]: option }));
  };

  const submitTest = () => {
    let s = 0;
    questions.forEach((q, i) => { if (answers[i] === q.answer) s++; });
    setScore(s);
    setScreen("result");
  };

  const reset = () => {
    setScreen("select");
    setTopic(null);
    setDifficulty("Medium");
    setCount(10);
    setQuestions([]);
    setAnswers({});
    setCurrent(0);
    setScore(0);
    setReviewFilter("all");
  };

  const filteredReview = questions.filter((q, i) => {
    if (reviewFilter === "correct") return answers[i] === q.answer;
    if (reviewFilter === "wrong")   return answers[i] !== q.answer;
    return true;
  });

  const pct = questions.length ? Math.round((score / questions.length) * 100) : 0;

  // ── SCREEN: SELECT ──────────────────────────────────────────────────────────
  if (screen === "select") {
    return (
      <div className="ml-0 md:ml-64 bg-gray-50 min-h-screen p-4 md:p-8">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="mb-8 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <Brain size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">AI Quiz Generator</h1>
              <p className="text-gray-500 text-sm mt-0.5">Generate personalised MCQs on any quant topic instantly</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {/* Topic grid */}
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Choose a topic</p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 mb-7">
            {TOPICS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTopic(t)}
                className={`text-left p-4 rounded-2xl border transition-all duration-200
                  ${topic?.key === t.key
                    ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-100"
                    : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/40"}`}
              >
                <div className="text-2xl mb-2">{t.emoji}</div>
                <div className="font-semibold text-gray-800 text-sm">{t.key}</div>
                <div className="text-xs text-gray-400 mt-1 leading-relaxed">{t.desc}</div>
              </button>
            ))}
          </div>

          {/* Options row */}
          <div className="flex flex-wrap gap-6 mb-7">
            {/* Difficulty */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Difficulty</p>
              <div className="flex gap-2">
                {DIFFICULTY.map((d) => (
                  <button
                    key={d.key}
                    onClick={() => setDifficulty(d.key)}
                    className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-all
                      ${difficulty === d.key ? d.color + " shadow-sm" : "border-gray-200 text-gray-500 bg-white hover:bg-gray-50"}`}
                  >
                    {d.key}
                  </button>
                ))}
              </div>
            </div>

            {/* Count */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Questions</p>
              <div className="flex gap-2">
                {QUESTION_COUNTS.map((n) => (
                  <button
                    key={n}
                    onClick={() => setCount(n)}
                    className={`w-12 h-9 rounded-xl border text-sm font-medium transition-all
                      ${count === n
                        ? "border-blue-500 bg-blue-600 text-white shadow-sm"
                        : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"}`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={startQuiz}
            disabled={!topic}
            className={`flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm transition-all
              ${topic
                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
          >
            <Sparkles size={16} />
            Generate {count} Questions with AI
          </button>

        </div>
      </div>
    );
  }

  // ── SCREEN: LOADING ─────────────────────────────────────────────────────────
  if (screen === "loading") {
    return (
      <div className="ml-0 md:ml-64 bg-gray-50 min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-5">
            <Loader2 size={28} className="text-white animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Generating your quiz…</h2>
          <p className="text-gray-400 text-sm mt-2">
            AI is crafting {count} {difficulty.toLowerCase()} questions on {topic?.key}
          </p>
        </div>
      </div>
    );
  }

  // ── SCREEN: QUIZ ────────────────────────────────────────────────────────────
  if (screen === "quiz" && questions.length > 0) {
    const q = questions[current];
    const selected = answers[current];
    const answered = Object.keys(answers).length;

    return (
      <div className="ml-0 md:ml-64 bg-gray-50 min-h-screen p-4 md:p-8">
        <div className="max-w-2xl mx-auto">

          {/* Top bar */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
                {topic?.emoji} {topic?.key}
              </span>
              <span className={`text-xs font-medium px-3 py-1 rounded-full border ${
                DIFFICULTY.find(d => d.key === difficulty)?.color
              }`}>
                {difficulty}
              </span>
            </div>
            <span className="text-xs text-gray-400">{answered} answered</span>
          </div>

          {/* Progress */}
          <ProgressBar current={current} total={questions.length} answers={answers} />

          {/* Card */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-4">
            <p className="text-xs text-gray-400 font-medium mb-3">
              Question {current + 1} of {questions.length}
            </p>
            <p className="text-gray-900 font-medium text-base leading-relaxed mb-6">
              {q.question}
            </p>

            <div className="space-y-2.5">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleOption(opt)}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all duration-150
                    ${selected === opt
                      ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                      : "border-gray-200 text-gray-700 bg-white hover:border-blue-300 hover:bg-blue-50"}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrent((c) => Math.max(0, c - 1))}
              disabled={current === 0}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 bg-white
                text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft size={15} /> Previous
            </button>

            {current === questions.length - 1 ? (
              <button
                onClick={submitTest}
                disabled={answered < questions.length}
                className={`flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all
                  ${answered === questions.length
                    ? "bg-green-600 text-white hover:bg-green-700 shadow-sm"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
              >
                Submit Test
                {answered < questions.length && (
                  <span className="text-xs font-normal ml-1">
                    ({questions.length - answered} left)
                  </span>
                )}
              </button>
            ) : (
              <button
                onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 text-white
                  text-sm font-medium hover:bg-blue-700 shadow-sm transition"
              >
                Next <ChevronRight size={15} />
              </button>
            )}
          </div>

          {/* Question dots */}
          <div className="flex flex-wrap gap-1.5 mt-5 justify-center">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-7 h-7 rounded-lg text-xs font-medium border transition-all
                  ${i === current
                    ? "bg-blue-600 text-white border-blue-600"
                    : answers[i]
                    ? "bg-blue-100 text-blue-700 border-blue-200"
                    : "bg-white text-gray-400 border-gray-200 hover:border-blue-300"}`}
              >
                {i + 1}
              </button>
            ))}
          </div>

        </div>
      </div>
    );
  }

  // ── SCREEN: RESULT ──────────────────────────────────────────────────────────
  if (screen === "result") {
    const correctCount = score;
    const wrongCount   = questions.length - score;

    return (
      <div className="ml-0 md:ml-64 bg-gray-50 min-h-screen p-4 md:p-8">
        <div className="max-w-2xl mx-auto">

          {/* Score card */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-5 text-center">
            <div className="text-4xl mb-3">{pct >= 70 ? "🏆" : pct >= 40 ? "📈" : "💪"}</div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Test Completed!</h2>
            <p className="text-sm text-gray-400 mb-5">
              {topic?.emoji} {topic?.key} · {difficulty}
            </p>
            <ScoreBadge score={score} total={questions.length} />
            <p className="text-sm text-gray-500 mt-4">
              {pct >= 70
                ? "Excellent work! You've mastered this topic 🎉"
                : pct >= 40
                ? "Good effort! A bit more practice and you'll ace it 📚"
                : "Keep going — every attempt makes you stronger 🚀"}
            </p>

            {/* Stats row */}
            <div className="flex gap-3 mt-5 justify-center">
              <div className="flex items-center gap-1.5 text-sm text-green-700 bg-green-50 border border-green-200 px-4 py-2 rounded-xl">
                <CheckCircle2 size={15} /> {correctCount} Correct
              </div>
              <div className="flex items-center gap-1.5 text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded-xl">
                <XCircle size={15} /> {wrongCount} Wrong
              </div>
              <div className="flex items-center gap-1.5 text-sm text-blue-700 bg-blue-50 border border-blue-200 px-4 py-2 rounded-xl">
                <Target size={15} /> {pct}% Accuracy
              </div>
            </div>
          </div>

          {/* Review section */}
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <BookOpen size={16} className="text-blue-500" /> Question Review
            </h3>
            <div className="flex gap-1.5">
              {["all", "correct", "wrong"].map((f) => (
                <button
                  key={f}
                  onClick={() => setReviewFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border capitalize transition-all
                    ${reviewFilter === f
                      ? f === "correct"
                        ? "bg-green-600 text-white border-green-600"
                        : f === "wrong"
                        ? "bg-red-500 text-white border-red-500"
                        : "bg-blue-600 text-white border-blue-600"
                      : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"}`}
                >
                  {f === "all" ? `All (${questions.length})` : f === "correct" ? `Correct (${correctCount})` : `Wrong (${wrongCount})`}
                </button>
              ))}
            </div>
          </div>

          {/* Review cards */}
          <div className="flex flex-col gap-3 mb-6">
            {filteredReview.map((q, filteredIdx) => {
              const origIdx = questions.indexOf(q);
              const userAns = answers[origIdx];
              const isCorrect = userAns === q.answer;
              return (
                <div
                  key={origIdx}
                  className={`bg-white rounded-2xl border p-5 shadow-sm transition-all
                    ${isCorrect ? "border-green-200" : "border-red-200"}`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <p className="text-sm font-medium text-gray-800 leading-relaxed flex-1">
                      <span className="text-gray-400 mr-1.5">Q{origIdx + 1}.</span>
                      {q.question}
                    </p>
                    {isCorrect
                      ? <CheckCircle2 size={18} className="text-green-500 min-w-[18px] mt-0.5" />
                      : <XCircle size={18} className="text-red-500 min-w-[18px] mt-0.5" />}
                  </div>

                  {/* Options */}
                  <div className="space-y-1.5 mb-3">
                    {q.options.map((opt, oi) => {
                      const isAnswer = opt === q.answer;
                      const isUser   = opt === userAns;
                      return (
                        <div
                          key={oi}
                          className={`px-3 py-2 rounded-lg text-sm border flex items-center justify-between
                            ${isAnswer
                              ? "bg-green-50 border-green-300 text-green-800 font-medium"
                              : isUser && !isCorrect
                              ? "bg-red-50 border-red-300 text-red-700 line-through"
                              : "bg-gray-50 border-gray-100 text-gray-500"}`}
                        >
                          {opt}
                          {isAnswer && <CheckCircle2 size={13} className="text-green-500" />}
                          {isUser && !isCorrect && <XCircle size={13} className="text-red-400" />}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                    <p className="text-xs font-semibold text-blue-600 mb-1">💡 Explanation</p>
                    <p className="text-xs text-blue-800 leading-relaxed">{q.explanation}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={reset}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 shadow-sm transition"
            >
              <RotateCcw size={14} /> Try Another Topic
            </button>
            <button
              onClick={startQuiz}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 hover:bg-gray-50 transition"
            >
              <Sparkles size={14} /> Regenerate Same Topic
            </button>
          </div>

        </div>
      </div>
    );
  }

  return null;
};

export default QuantAI;