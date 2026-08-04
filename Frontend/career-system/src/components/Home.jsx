import React, { useState, useEffect } from "react";
import {
  Briefcase,
  ScanSearch,
  BrainCircuit,
  NotebookText,
  ArrowRight,
  FileText,
  Code2,
  TrendingUp,
  Users,
  Star,
  ChevronRight,
  BookOpen,
  Target,
  Zap,
  Award,
  Clock,
  CheckCircle2,
} from "lucide-react";

/* ─── tiny hook: count-up animation ─── */
const useCountUp = (end, duration = 1800, start = 0) => {
  const [count, setCount] = useState(start);
  useEffect(() => {
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * (end - start) + start));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration, start]);
  return count;
};

/* ─── Stat card with live count-up ─── */
const StatCard = ({ value, suffix, label, icon: Icon, color }) => {
  const num = useCountUp(value);
  return (
    <div className="flex flex-col items-center gap-1 px-6 py-4 bg-white rounded-2xl shadow-sm border border-slate-100">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-1 ${color}`}>
        <Icon size={17} className="text-white" />
      </div>
      <p className="text-2xl font-bold text-slate-800 tracking-tight">
        {num.toLocaleString()}{suffix}
      </p>
      <p className="text-xs text-slate-500 font-medium text-center">{label}</p>
    </div>
  );
};

/* ─── Feature Card ─── */
const FeatureCard = ({ title, desc, icon: Icon, badge, accent, onClick }) => (
  <button
    onClick={onClick}
    className="group relative flex flex-col items-start gap-4 bg-white border border-slate-100
      rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1
      transition-all duration-300 text-left w-full overflow-hidden"
  >
    {/* subtle top-accent bar */}
    <div className={`absolute top-0 left-0 right-0 h-0.5 ${accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

    <div className="flex items-start justify-between w-full">
      <div className={`w-11 h-11 flex items-center justify-center rounded-xl ${accent} bg-opacity-10`}>
        <Icon size={20} className={`${accent.replace("bg-", "text-")}`} />
      </div>
      {badge && (
        <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
          {badge}
        </span>
      )}
    </div>

    <div className="flex-1">
      <h2 className="font-semibold text-slate-800 text-base leading-snug">{title}</h2>
      <p className="text-slate-500 text-sm mt-1.5 leading-relaxed">{desc}</p>
    </div>

    <div className="flex items-center gap-1 text-xs font-semibold text-slate-400 group-hover:text-blue-600 transition-colors">
      Explore <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
    </div>
  </button>
);

/* ─── Quick action pill ─── */
const QuickAction = ({ label, icon: Icon, color }) => (
  <button className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all hover:scale-105 ${color}`}>
    <Icon size={14} /> {label}
  </button>
);

/* ─── Activity feed item ─── */
const Activity = ({ text, time, type }) => {
  const colors = {
    job: "bg-blue-100 text-blue-600",
    note: "bg-violet-100 text-violet-600",
    test: "bg-amber-100 text-amber-600",
    resume: "bg-emerald-100 text-emerald-600",
  };
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-50 last:border-0">
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${colors[type]}`}>
        {type === "job" ? "J" : type === "note" ? "N" : type === "test" ? "T" : "R"}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-700 leading-snug">{text}</p>
        <p className="text-xs text-slate-400 mt-0.5">{time}</p>
      </div>
    </div>
  );
};

/* ─── Announcement banner item ─── */
const AnnouncementItem = ({ tag, text, hot }) => (
  <div className="flex items-start gap-3 py-3 border-b border-slate-50 last:border-0">
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md flex-shrink-0 mt-0.5
      ${hot ? "bg-rose-100 text-rose-600" : "bg-blue-50 text-blue-600"}`}>
      {tag}
    </span>
    <p className="text-sm text-slate-600 leading-snug">{text}</p>
  </div>
);

/* ══════════════════════════════════════════ */
/*                 MAIN HOME                  */
/* ══════════════════════════════════════════ */
const Home = () => {
  const [greeting, setGreeting] = useState("Good morning");

  useEffect(() => {
    const h = new Date().getHours();
    if (h >= 12 && h < 17) setGreeting("Good afternoon");
    else if (h >= 17) setGreeting("Good evening");
  }, []);

  const features = [
    {
      title: "ATS Resume Checker",
      desc: "Upload your resume and get an instant AI-powered ATS compatibility score with actionable suggestions.",
      icon: ScanSearch,
      badge: "AI Powered",
      accent: "bg-blue-500",
    },
    {
      title: "Job & Internship Search",
      desc: "Browse curated listings from top companies. Filter by role, location, stipend, and more.",
      icon: Briefcase,
      badge: "New Jobs",
      accent: "bg-emerald-500",
    },
    {
      title: "Aptitude Preparation",
      desc: "Sharpen your placement skills with 1000+ quant, logical, and verbal practice questions.",
      icon: BrainCircuit,
      badge: null,
      accent: "bg-amber-500",
    },
    {
      title: "Study Notes",
      desc: "Semester-wise notes for all subjects. Download PDFs or read online instantly.",
      icon: NotebookText,
      badge: null,
      accent: "bg-violet-500",
    },
    {
      title: "DSA Sheet",
      desc: "Structured topic-wise DSA problem sheets aligned with FAANG interview patterns.",
      icon: Code2,
      badge: "Popular",
      accent: "bg-rose-500",
    },
    {
      title: "Previous Year Papers",
      desc: "Access university and company-specific question papers with answer keys.",
      icon: FileText,
      badge: null,
      accent: "bg-cyan-500",
    },
  ];

  const stats = [
    { value: 12400, suffix: "+", label: "Active Students", icon: Users, color: "bg-blue-500" },
    { value: 850,   suffix: "+", label: "Job Listings",    icon: Briefcase, color: "bg-emerald-500" },
    { value: 3200,  suffix: "+", label: "Study Notes",     icon: BookOpen, color: "bg-violet-500" },
    { value: 98,    suffix: "%", label: "Satisfaction",    icon: Star, color: "bg-amber-500" },
  ];

  const recentActivity = [
    { text: "TCS Ninja drive opened — Apply before June 30", time: "2 hours ago", type: "job" },
    { text: "Data Structures notes (Sem 4) uploaded", time: "5 hours ago", type: "note" },
    { text: "New mock test: Infosys Aptitude Pattern 2025", time: "Yesterday", type: "test" },
    { text: "Resume tips: How to beat ATS in 2025", time: "2 days ago", type: "resume" },
  ];

  const announcements = [
    { tag: "Hot", text: "Google Summer Internship 2025 — applications open now!", hot: true },
    { tag: "New", text: "GATE 2026 preparation resources added to Notes section.", hot: false },
    { tag: "Hot", text: "Wipro Elite NLTH registration closes this Friday.", hot: true },
    { tag: "Update", text: "DSA Sheet updated with 50 new DP problems.", hot: false },
  ];

  const checklist = [
    { label: "Update your resume", done: false },
    { label: "Complete today's aptitude quiz", done: true },
    { label: "Apply to 2 new jobs", done: false },
    { label: "Read OS notes — Chapter 3", done: true },
  ];

  return (
    <div className="mt-16 md:mt-0 md:ml-64 min-h-screen bg-slate-50">
      {/* ── Top announcement ticker ── */}
      <div className="bg-blue-600 text-white text-xs font-medium py-2 px-4 md:px-8 flex items-center gap-3 overflow-hidden">
        <span className="bg-white text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 uppercase tracking-wider">Live</span>
        <p className="whitespace-nowrap">
          🎉 TCS NQT registration open &nbsp;·&nbsp; New DSA sheet added &nbsp;·&nbsp; Infosys off-campus drive this Saturday &nbsp;·&nbsp; 500+ new notes uploaded this week
        </p>
      </div>

      <div className="p-4 md:p-8 space-y-8">

        {/* ── Hero Banner ── */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 shadow-xl shadow-blue-200">
          {/* decorative circles */}
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/5 rounded-full" />
          <div className="absolute -bottom-16 -right-4 w-48 h-48 bg-white/5 rounded-full" />
          <div className="absolute top-4 right-32 w-16 h-16 bg-white/10 rounded-full" />

          <div className="relative z-10 p-6 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-xl">
              <p className="text-blue-200 text-sm font-medium mb-2">{greeting}, Student 👋</p>
              <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight">
                Your all-in-one platform for<br className="hidden md:block" />
                <span className="text-blue-200"> career & academic</span> success.
              </h1>
              <p className="mt-3 text-blue-100 text-sm md:text-base leading-relaxed max-w-lg">
                Resume analysis, job search, aptitude practice, DSA prep, and study notes — everything a student needs, in one place.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button className="flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:shadow-lg hover:-translate-y-0.5">
                  Get Started <ArrowRight size={15} />
                </button>
                <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all border border-white/20">
                  Watch Demo
                </button>
              </div>
            </div>

            {/* mini checklist inside hero */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 min-w-[220px] flex-shrink-0">
              <p className="text-white text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                <Target size={13} /> Today's Goals
              </p>
              <div className="space-y-2.5">
                {checklist.map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${item.done ? "bg-emerald-400 border-emerald-400" : "border-white/40"}`}>
                      {item.done && <CheckCircle2 size={10} className="text-white" />}
                    </div>
                    <span className={`text-xs ${item.done ? "text-white/50 line-through" : "text-white/90"}`}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {stats.map((s, i) => <StatCard key={i} {...s} />)}
        </div>

        {/* ── Quick Actions ── */}
        <div>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-3">Quick Actions</p>
          <div className="flex flex-wrap gap-2">
            <QuickAction label="Check Resume Score" icon={ScanSearch} color="bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100" />
            <QuickAction label="Browse Jobs" icon={Briefcase} color="bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100" />
            <QuickAction label="Start Aptitude Quiz" icon={BrainCircuit} color="bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100" />
            <QuickAction label="DSA Sheet" icon={Code2} color="bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-100" />
            <QuickAction label="Download Notes" icon={NotebookText} color="bg-violet-50 text-violet-700 border-violet-100 hover:bg-violet-100" />
          </div>
        </div>

        {/* ── Feature Cards ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Explore Features</h2>
              <p className="text-sm text-slate-500">Everything you need to land your dream role</p>
            </div>
            <button className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:underline">
              View all <ChevronRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((item, index) => (
              <FeatureCard key={index} {...item} onClick={() => {}} />
            ))}
          </div>
        </div>

        {/* ── Bottom 2-col: Activity + Announcements ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-amber-500" />
                <h3 className="font-semibold text-slate-800 text-sm">Recent Activity</h3>
              </div>
              <button className="text-xs text-blue-600 hover:underline font-medium">See all</button>
            </div>
            <div>
              {recentActivity.map((a, i) => <Activity key={i} {...a} />)}
            </div>
          </div>

          {/* Announcements */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Award size={16} className="text-rose-500" />
                <h3 className="font-semibold text-slate-800 text-sm">Announcements</h3>
              </div>
              <button className="text-xs text-blue-600 hover:underline font-medium">See all</button>
            </div>
            <div>
              {announcements.map((a, i) => <AnnouncementItem key={i} {...a} />)}
            </div>
          </div>

        </div>

        {/* ── CTA Banner ── */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="text-emerald-400" />
              <span className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">Pro Tip</span>
            </div>
            <h3 className="text-white font-bold text-lg">Ready for placement season?</h3>
            <p className="text-slate-400 text-sm mt-1 max-w-md">
              Students who use EduLaunch regularly are <span className="text-white font-medium">3× more likely</span> to crack placements in their first attempt.
            </p>
          </div>
          <button className="flex-shrink-0 flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:shadow-lg whitespace-nowrap">
            Start Preparing <ArrowRight size={15} />
          </button>
        </div>

        {/* ── Footer spacer ── */}
        <div className="flex items-center justify-center py-4 gap-2 text-slate-400 text-xs">
          <Clock size={12} />
          <span>Last updated: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
          <span>·</span>
          <span className="text-blue-500 font-medium">EduLaunch v2.0</span>
        </div>

      </div>
    </div>
  );
};

export default Home;
