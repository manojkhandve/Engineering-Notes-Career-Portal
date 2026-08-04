// DSASheet.jsx — LeetCode-style DSA tracker with full activity dashboard
import React, { useState, useEffect, useMemo } from "react";
import {
  CheckCircle2, Circle, ExternalLink, Youtube, ChevronDown,
  ChevronUp, Search, Filter, Trophy, Flame, Target, TrendingUp,
  BookOpen, Code2, BarChart3, Calendar, Star, Zap, RotateCcw,
  ChevronRight, Building2,
} from "lucide-react";
import { DSA_TOPICS, getAllQuestions, TOTAL_COUNTS } from "./dsaData";

/* ─── helpers ─── */
const STORAGE_KEY = "edl_dsa_solved";

const loadSolved = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { return {}; }
};

const saveSolved = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const DIFFICULTY_META = {
  Easy:   { bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/30", dot: "bg-emerald-400" },
  Medium: { bg: "bg-amber-500/15",   text: "text-amber-400",   border: "border-amber-500/30",   dot: "bg-amber-400"   },
  Hard:   { bg: "bg-rose-500/15",    text: "text-rose-400",    border: "border-rose-500/30",    dot: "bg-rose-400"    },
};

const TOPIC_COLORS = {
  blue:   { ring: "ring-blue-500/40",   bg: "bg-blue-500/10",   text: "text-blue-400",   bar: "bg-blue-500"   },
  purple: { ring: "ring-purple-500/40", bg: "bg-purple-500/10", text: "text-purple-400", bar: "bg-purple-500" },
  green:  { ring: "ring-emerald-500/40",bg: "bg-emerald-500/10",text: "text-emerald-400",bar: "bg-emerald-500"},
  amber:  { ring: "ring-amber-500/40",  bg: "bg-amber-500/10",  text: "text-amber-400",  bar: "bg-amber-500"  },
  rose:   { ring: "ring-rose-500/40",   bg: "bg-rose-500/10",   text: "text-rose-400",   bar: "bg-rose-500"   },
  cyan:   { ring: "ring-cyan-500/40",   bg: "bg-cyan-500/10",   text: "text-cyan-400",   bar: "bg-cyan-500"   },
};

/* ─── Circular progress (like LC) ─── */
const CircleProgress = ({ value, max, label, color, size = 80 }) => {
  const pct = max === 0 ? 0 : value / max;
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;
  const colorMap = { emerald: "#10b981", amber: "#f59e0b", rose: "#f43f5e", blue: "#3b82f6" };
  const stroke = colorMap[color] || "#3b82f6";
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1f2937" strokeWidth={6} />
        <circle
          cx={size/2} cy={size/2} r={r} fill="none"
          stroke={stroke} strokeWidth={6}
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ transition: "stroke-dasharray 0.6s ease" }}
        />
        <text x={size/2} y={size/2 + 5} textAnchor="middle" fill="white" fontSize="14" fontWeight="600">{value}</text>
      </svg>
      <span className="text-xs text-slate-500">{label}</span>
    </div>
  );
};

/* ─── Activity Heatmap (last 7 weeks) ─── */
const ActivityHeatmap = ({ activityLog }) => {
  const today = new Date();
  const cells = Array.from({ length: 49 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (48 - i));
    const key = d.toISOString().slice(0, 10);
    return { key, count: activityLog[key] || 0 };
  });
  const levels = (c) => {
    if (c === 0) return "bg-slate-800";
    if (c === 1) return "bg-emerald-900";
    if (c === 2) return "bg-emerald-700";
    if (c <= 4) return "bg-emerald-500";
    return "bg-emerald-400";
  };
  return (
    <div>
      <div className="flex flex-wrap gap-1">
        {cells.map((cell, i) => (
          <div
            key={i}
            title={`${cell.key}: ${cell.count} solved`}
            className={`w-3.5 h-3.5 rounded-sm ${levels(cell.count)} transition-colors`}
          />
        ))}
      </div>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-xs text-slate-600">Less</span>
        {["bg-slate-800","bg-emerald-900","bg-emerald-700","bg-emerald-500","bg-emerald-400"].map((c,i) => (
          <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
        ))}
        <span className="text-xs text-slate-600">More</span>
      </div>
    </div>
  );
};

/* ─── Single question row ─── */
const QuestionRow = ({ q, solved, onToggle, index }) => {
  const d = DIFFICULTY_META[q.level];
  const isSolved = !!solved[q.id];
  return (
    <tr className={`border-b border-slate-800/60 hover:bg-slate-800/40 transition-all group ${isSolved ? "opacity-70" : ""}`}>
      {/* checkbox */}
      <td className="pl-4 py-3 w-10">
        <button onClick={() => onToggle(q.id)} className="flex items-center justify-center">
          {isSolved
            ? <CheckCircle2 size={18} className="text-emerald-400" />
            : <Circle size={18} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
          }
        </button>
      </td>
      {/* index */}
      <td className="py-3 px-2 text-xs text-slate-600 w-8">{index + 1}</td>
      {/* name */}
      <td className="py-3 pr-4">
        <span className={`text-sm font-medium ${isSolved ? "text-slate-500 line-through" : "text-slate-200"}`}>
          {q.name}
        </span>
        {q.companies && (
          <div className="flex items-center gap-1 mt-1 flex-wrap">
            {q.companies.map(c => (
              <span key={c} className="text-[10px] text-slate-600 bg-slate-800 px-1.5 py-0.5 rounded">{c}</span>
            ))}
          </div>
        )}
      </td>
      {/* difficulty */}
      <td className="py-3 px-3 hidden sm:table-cell">
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${d.bg} ${d.text} ${d.border}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${d.dot}`} />
          {q.level}
        </span>
      </td>
      {/* LC link */}
      <td className="py-3 px-3">
        <a href={q.link} target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-all">
          <ExternalLink size={11} /> LeetCode
        </a>
      </td>
      {/* YT */}
      <td className="py-3 px-3 hidden md:table-cell">
        <a href={q.youtube} target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all">
          <Youtube size={11} /> Solution
        </a>
      </td>
    </tr>
  );
};

/* ─── Topic accordion section ─── */
const TopicSection = ({ topic, solved, onToggle, filterLevel, searchQuery }) => {
  const [open, setOpen] = useState(true);
  const col = TOPIC_COLORS[topic.color];

  const allQs = topic.days.flatMap(d => d.questions);
  const filtered = allQs.filter(q =>
    (!filterLevel || q.level === filterLevel) &&
    (!searchQuery || q.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  const solvedCount = allQs.filter(q => solved[q.id]).length;
  const pct = Math.round((solvedCount / allQs.length) * 100);

  if (filtered.length === 0) return null;

  return (
    <div className={`rounded-2xl border border-slate-800 overflow-hidden shadow-lg`}>
      {/* topic header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-4 md:p-5 hover:bg-slate-800/40 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ring-1 ${col.ring} ${col.bg}`}>
            <span className={col.text}>{topic.icon}</span>
          </div>
          <div className="text-left">
            <p className="font-semibold text-slate-100 text-sm">{topic.title}</p>
            <p className="text-xs text-slate-500">{solvedCount}/{allQs.length} solved · {pct}%</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* mini progress bar */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-24 h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div className={`h-full ${col.bar} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
            </div>
            <span className="text-xs text-slate-500">{pct}%</span>
          </div>
          {open ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
        </div>
      </button>

      {/* questions table */}
      {open && (
        <div className="border-t border-slate-800">
          {topic.days.map((day, di) => {
            const dayFiltered = day.questions.filter(q =>
              (!filterLevel || q.level === filterLevel) &&
              (!searchQuery || q.name.toLowerCase().includes(searchQuery.toLowerCase()))
            );
            if (dayFiltered.length === 0) return null;
            return (
              <div key={di}>
                <div className="px-4 py-2 bg-slate-800/30 border-b border-slate-800">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{day.day}</span>
                </div>
                <table className="w-full">
                  <tbody>
                    {dayFiltered.map((q, i) => (
                      <QuestionRow key={q.id} q={q} solved={solved} onToggle={onToggle} index={i} />
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════ */
/*              MAIN DSA SHEET               */
/* ══════════════════════════════════════════ */
const DSASheet = () => {
  const [solved, setSolved] = useState(loadSolved);
  const [activityLog, setActivityLog] = useState(() => {
    try { return JSON.parse(localStorage.getItem("edl_dsa_activity")) || {}; }
    catch { return {}; }
  });
  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  const [filterTopic, setFilterTopic] = useState("");
  const [activeTab, setActiveTab] = useState("sheet"); // "sheet" | "stats"

  const allQs = useMemo(() => getAllQuestions(), []);
  const totalQ = allQs.length;
  const solvedAll = Object.values(solved).filter(Boolean).length;
  const solvedEasy = allQs.filter(q => q.level === "Easy" && solved[q.id]).length;
  const solvedMed  = allQs.filter(q => q.level === "Medium" && solved[q.id]).length;
  const solvedHard = allQs.filter(q => q.level === "Hard" && solved[q.id]).length;

  /* streak calc */
  const streak = useMemo(() => {
    let s = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      if (activityLog[key]) s++;
      else break;
    }
    return s;
  }, [activityLog]);

  const toggleSolved = (id) => {
    const updated = { ...solved, [id]: !solved[id] };
    setSolved(updated);
    saveSolved(updated);

    // log activity
    if (!solved[id]) {
      const today = new Date().toISOString().slice(0, 10);
      const updatedLog = { ...activityLog, [today]: (activityLog[today] || 0) + 1 };
      setActivityLog(updatedLog);
      localStorage.setItem("edl_dsa_activity", JSON.stringify(updatedLog));
    }
  };

  const resetAll = () => {
    if (window.confirm("Reset all progress? This cannot be undone.")) {
      setSolved({});
      saveSolved({});
    }
  };

  const visibleTopics = DSA_TOPICS.filter(t => !filterTopic || t.id === filterTopic);

  return (
    <div className="md:ml-64 min-h-screen bg-[#0d1117] text-white">

      {/* ── top banner ── */}
      <div className="bg-gradient-to-r from-orange-600/20 via-rose-600/10 to-transparent border-b border-slate-800 px-4 md:px-8 py-3 flex items-center gap-3">
        <Zap size={14} className="text-orange-400 flex-shrink-0" />
        <p className="text-xs text-slate-400">
          <span className="text-orange-400 font-semibold">EduLaunch DSA Sheet</span>
          {" "}— Curated {totalQ} questions across {DSA_TOPICS.length} topics. Fully aligned with FAANG interview patterns.
        </p>
      </div>

      <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              <span className="text-orange-400">DSA</span> Problem Sheet
            </h1>
            <p className="text-slate-500 text-sm mt-1">Track your progress · Practice consistently · Crack interviews</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("sheet")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === "sheet" ? "bg-slate-700 text-white" : "text-slate-500 hover:text-slate-300"}`}
            >
              <span className="flex items-center gap-2"><BookOpen size={14} /> Sheet</span>
            </button>
            <button
              onClick={() => setActiveTab("stats")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === "stats" ? "bg-slate-700 text-white" : "text-slate-500 hover:text-slate-300"}`}
            >
              <span className="flex items-center gap-2"><BarChart3 size={14} /> My Stats</span>
            </button>
            <button onClick={resetAll} title="Reset progress" className="p-2 rounded-xl text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all">
              <RotateCcw size={15} />
            </button>
          </div>
        </div>

        {/* ── STATS TAB ── */}
        {activeTab === "stats" && (
          <div className="space-y-6">
            {/* top stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: "Total Solved",  value: solvedAll,  max: totalQ, icon: Trophy,   color: "text-amber-400",   bg: "bg-amber-500/10" },
                { label: "Day Streak",    value: streak,     max: 30,     icon: Flame,    color: "text-orange-400",  bg: "bg-orange-500/10" },
                { label: "Easy Solved",   value: solvedEasy, max: TOTAL_COUNTS.Easy,   icon: Target, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                { label: "Hard Solved",   value: solvedHard, max: TOTAL_COUNTS.Hard,   icon: Star,  color: "text-rose-400",    bg: "bg-rose-500/10" },
              ].map(({ label, value, max, icon: Icon, color, bg }) => (
                <div key={label} className={`${bg} rounded-2xl border border-slate-800 p-4 flex items-center gap-3`}>
                  <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={18} className={color} />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white">{value}<span className="text-sm text-slate-600 font-normal">/{max}</span></p>
                    <p className="text-xs text-slate-500">{label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* circle progresses + heatmap */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                <h3 className="text-sm font-semibold text-slate-400 mb-5 flex items-center gap-2">
                  <BarChart3 size={14} /> Difficulty Breakdown
                </h3>
                <div className="flex justify-around">
                  <CircleProgress value={solvedEasy} max={TOTAL_COUNTS.Easy} label="Easy" color="emerald" />
                  <CircleProgress value={solvedMed}  max={TOTAL_COUNTS.Medium} label="Medium" color="amber" />
                  <CircleProgress value={solvedHard} max={TOTAL_COUNTS.Hard} label="Hard" color="rose" />
                  <CircleProgress value={solvedAll}  max={totalQ} label="Total" color="blue" size={90} />
                </div>
              </div>

              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                <h3 className="text-sm font-semibold text-slate-400 mb-4 flex items-center gap-2">
                  <Calendar size={14} /> Activity — Last 7 Weeks
                </h3>
                <ActivityHeatmap activityLog={activityLog} />
                <p className="text-xs text-slate-600 mt-3">{streak > 0 ? `🔥 ${streak}-day streak! Keep going!` : "Start solving to build your streak!"}</p>
              </div>
            </div>

            {/* per-topic progress */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
              <h3 className="text-sm font-semibold text-slate-400 mb-5 flex items-center gap-2">
                <TrendingUp size={14} /> Topic Progress
              </h3>
              <div className="space-y-4">
                {DSA_TOPICS.map(topic => {
                  const topicQs = topic.days.flatMap(d => d.questions);
                  const done = topicQs.filter(q => solved[q.id]).length;
                  const pct = Math.round((done / topicQs.length) * 100);
                  const col = TOPIC_COLORS[topic.color];
                  return (
                    <div key={topic.id} className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${col.bg} flex-shrink-0`}>
                        <span className={col.text}>{topic.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between mb-1">
                          <span className="text-xs font-medium text-slate-300">{topic.title}</span>
                          <span className="text-xs text-slate-500">{done}/{topicQs.length}</span>
                        </div>
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className={`h-full ${col.bar} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-slate-500 w-10 text-right">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── SHEET TAB ── */}
        {activeTab === "sheet" && (
          <div className="space-y-5">
            {/* overall progress bar */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* circles row */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  <CircleProgress value={solvedAll} max={totalQ} label="Solved" color="blue" size={72} />
                  <div className="space-y-2">
                    {[
                      { label: "Easy",   val: solvedEasy, max: TOTAL_COUNTS.Easy,   c: "text-emerald-400", bar: "bg-emerald-500" },
                      { label: "Medium", val: solvedMed,  max: TOTAL_COUNTS.Medium, c: "text-amber-400",   bar: "bg-amber-500"   },
                      { label: "Hard",   val: solvedHard, max: TOTAL_COUNTS.Hard,   c: "text-rose-400",    bar: "bg-rose-500"    },
                    ].map(({ label, val, max, c, bar }) => (
                      <div key={label} className="flex items-center gap-3 min-w-[160px]">
                        <span className={`text-xs font-semibold ${c} w-12`}>{label}</span>
                        <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className={`h-full ${bar} rounded-full transition-all`} style={{ width: `${max ? Math.round(val/max*100) : 0}%` }} />
                        </div>
                        <span className="text-xs text-slate-500 w-12 text-right">{val}/{max}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* streak + tip */}
                <div className="flex-1 sm:text-right flex flex-col gap-1 sm:items-end">
                  {streak > 0 && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-xl text-orange-400 text-sm font-semibold">
                      <Flame size={14} /> {streak} day streak
                    </div>
                  )}
                  <p className="text-xs text-slate-600 mt-1">
                    {Math.round((solvedAll / totalQ) * 100)}% complete · {totalQ - solvedAll} remaining
                  </p>
                </div>
              </div>
            </div>

            {/* filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* search */}
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search problems..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>
              {/* difficulty filter */}
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-xl p-1">
                {["", "Easy", "Medium", "Hard"].map(level => (
                  <button
                    key={level}
                    onClick={() => setFilterLevel(level)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                      ${filterLevel === level
                        ? level === "" ? "bg-slate-700 text-white"
                          : level === "Easy" ? "bg-emerald-500/20 text-emerald-400"
                          : level === "Medium" ? "bg-amber-500/20 text-amber-400"
                          : "bg-rose-500/20 text-rose-400"
                        : "text-slate-500 hover:text-slate-300"
                      }`}
                  >{level || "All"}</button>
                ))}
              </div>
              {/* topic filter */}
              <select
                value={filterTopic}
                onChange={e => setFilterTopic(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-400 focus:outline-none focus:border-blue-500/50 transition-colors"
              >
                <option value="">All Topics</option>
                {DSA_TOPICS.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
              </select>
            </div>

            {/* topic sections */}
            <div className="space-y-4">
              {visibleTopics.map(topic => (
                <TopicSection
                  key={topic.id}
                  topic={topic}
                  solved={solved}
                  onToggle={toggleSolved}
                  filterLevel={filterLevel}
                  searchQuery={search}
                />
              ))}
            </div>

            {/* empty state */}
            {visibleTopics.every(t =>
              t.days.flatMap(d => d.questions).filter(q =>
                (!filterLevel || q.level === filterLevel) &&
                (!search || q.name.toLowerCase().includes(search.toLowerCase()))
              ).length === 0
            ) && (
              <div className="text-center py-20 text-slate-600">
                <Code2 size={40} className="mx-auto mb-3 opacity-30" />
                <p className="font-medium">No questions match your filters</p>
                <button onClick={() => { setSearch(""); setFilterLevel(""); setFilterTopic(""); }}
                  className="mt-3 text-sm text-blue-500 hover:underline">Clear filters</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DSASheet;
