import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const DIFFICULTIES = [
  {
    value: "basic",
    label: "Basic",
    desc: "Fundamentals & core concepts",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
      </svg>
    ),
    accent: "emerald",
    bar: "w-1/3",
  },
  {
    value: "intermediate",
    label: "Intermediate",
    desc: "Real-world problem solving",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    accent: "amber",
    bar: "w-2/3",
  },
  {
    value: "hard",
    label: "Hard",
    desc: "Senior-level deep dives",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343M17.657 18.657L6.343 7.343m11.314 11.314L6.343 7.343" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3" />
      </svg>
    ),
    accent: "rose",
    bar: "w-full",
  },
];

const SUGGESTED_ROLES = [
  "Frontend Developer",
  "Backend Engineer",
  "Full Stack Developer",
  "Data Scientist",
  "Product Manager",
  "DevOps Engineer",
];

const QUESTION_COUNTS = [3, 5, 7, 10];

const accentMap = {
  emerald: {
    card: "border-emerald-400/40 bg-emerald-400/5",
    icon: "bg-emerald-400/15 text-emerald-400",
    bar: "bg-emerald-400",
    label: "text-emerald-400",
    ring: "ring-emerald-400/40",
  },
  amber: {
    card: "border-amber-400/40 bg-amber-400/5",
    icon: "bg-amber-400/15 text-amber-400",
    bar: "bg-amber-400",
    label: "text-amber-400",
    ring: "ring-amber-400/40",
  },
  rose: {
    card: "border-rose-400/40 bg-rose-400/5",
    icon: "bg-rose-400/15 text-rose-400",
    bar: "bg-rose-400",
    label: "text-rose-400",
    ring: "ring-rose-400/40",
  },
};

const InterviewSetup = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [difficulty, setDifficulty] = useState("intermediate");
  const [questionCount, setQuestionCount] = useState(5);
  const [focused, setFocused] = useState(false);

  const startInterview = () => {
    if (!role.trim()) return;
    navigate("/ai-interview/session", { state: { role, difficulty, questionCount } });
  };

  const selected = DIFFICULTIES.find((d) => d.value === difficulty);
  const accent = accentMap[selected.accent];

  return (
    <div className="min-h-screen bg-slate-950 md:ml-64 flex items-center justify-center px-4 py-10">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700&family=Mulish:wght@400;500;600&display=swap');
        .font-display { font-family: 'Bricolage Grotesque', sans-serif; }
        .font-body { font-family: 'Mulish', sans-serif; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        .fade-up { animation: fadeUp 0.5s ease both; }
        .btn-shine {
          background: linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa, #8b5cf6, #6366f1);
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }
      `}</style>

      <div className="w-full max-w-lg font-body">

        {/* Header */}
        <div className="text-center mb-10 fade-up">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            AI Interview Coach
          </div>
          <h1 className="font-display text-4xl font-700 text-white tracking-tight leading-tight mb-2">
            Ready to Practice?
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Configure your mock interview and get real-time AI feedback.
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900 border border-white/[0.07] rounded-2xl p-6 shadow-xl fade-up" style={{ animationDelay: "0.1s" }}>

          {/* Role Input */}
          <div className="mb-6">
            <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
              Job Role
            </label>
            <div className={`relative rounded-xl border transition-all duration-200 ${focused ? "border-indigo-500/60 ring-2 ring-indigo-500/20" : "border-white/[0.08]"} bg-slate-800/60`}>
              <input
                type="text"
                placeholder="e.g. Frontend Developer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onKeyDown={(e) => e.key === "Enter" && startInterview()}
                className="w-full bg-transparent px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none rounded-xl"
              />
              {role && (
                <button onClick={() => setRole("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Suggestions */}
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {SUGGESTED_ROLES.map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-all duration-150
                    ${role === r
                      ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300"
                      : "bg-slate-800 border-white/[0.06] text-slate-500 hover:text-slate-300 hover:border-white/20"
                    }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div className="mb-6">
            <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
              Difficulty
            </label>
            <div className="grid grid-cols-3 gap-2">
              {DIFFICULTIES.map((d) => {
                const a = accentMap[d.accent];
                const isSelected = difficulty === d.value;
                return (
                  <button
                    key={d.value}
                    onClick={() => setDifficulty(d.value)}
                    className={`relative flex flex-col items-center gap-2 p-3 rounded-xl border text-center transition-all duration-200
                      ${isSelected
                        ? `${a.card} ${a.ring} ring-2`
                        : "bg-slate-800/60 border-white/[0.06] hover:border-white/15"
                      }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isSelected ? a.icon : "bg-slate-700 text-slate-400"}`}>
                      {d.icon}
                    </div>
                    <div>
                      <p className={`text-xs font-bold transition-colors ${isSelected ? a.label : "text-slate-300"}`}>{d.label}</p>
                      <p className="text-slate-600 text-[10px] leading-tight mt-0.5 hidden sm:block">{d.desc}</p>
                    </div>
                    <div className="w-full h-0.5 bg-slate-700 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${d.bar} ${isSelected ? a.bar : "bg-slate-600"}`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question Count */}
          <div className="mb-6">
            <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
              Number of Questions
            </label>
            <div className="grid grid-cols-4 gap-2">
              {QUESTION_COUNTS.map((n) => (
                <button
                  key={n}
                  onClick={() => setQuestionCount(n)}
                  className={`py-2.5 rounded-xl border text-sm font-semibold transition-all duration-150
                    ${questionCount === n
                      ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300 ring-2 ring-indigo-500/20"
                      : "bg-slate-800/60 border-white/[0.06] text-slate-400 hover:text-slate-200 hover:border-white/15"
                    }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/[0.06] mb-5" />

          {/* Summary row */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-5">
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
              {questionCount} questions
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
              ~{questionCount * 2}–{questionCount * 3} min
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              AI feedback
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={startInterview}
            disabled={!role.trim()}
            className={`w-full py-3.5 rounded-xl font-semibold text-sm tracking-wide flex items-center justify-center gap-2 transition-all duration-200
              ${role.trim()
                ? "btn-shine text-white shadow-lg shadow-indigo-500/25 hover:scale-[1.01] active:scale-[0.99]"
                : "bg-slate-800 text-slate-600 cursor-not-allowed"
              }`}
          >
            {role.trim() ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Start Interview
              </>
            ) : (
              "Enter a job role to continue"
            )}
          </button>
        </div>

        <p className="text-center text-slate-600 text-xs mt-5 fade-up" style={{ animationDelay: "0.2s" }}>
          Your answers are analysed in real time — no data is stored.
        </p>
      </div>
    </div>
  );
};

export default InterviewSetup;
