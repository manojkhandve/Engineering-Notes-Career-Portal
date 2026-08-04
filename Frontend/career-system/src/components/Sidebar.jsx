import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Briefcase,
  ScanSearch,
  BrainCircuit,
  NotebookText,
  User,
  LogIn,
  Menu,
  X,
  Brain,
  Code2,
  ClipboardCheck,
  LayoutDashboard,
  ChevronRight,
  Rocket,
  Sparkles,
} from "lucide-react";

const menuGroups = [
  {
    label: "Main",
    items: [
      { name: "Home",         path: "/",          icon: Home },
      { name: "Profile",      path: "/profile",   icon: User },
    ],
  },
  {
    label: "Career",
    items: [
      { name: "Jobs",         path: "/jobs",           icon: Briefcase },
      { name: "Applied Jobs", path: "/applied-jobs",   icon: ClipboardCheck, badge: "New" },
      { name: "ATS Checker",  path: "/ats",            icon: ScanSearch,     badge: "AI" },
      { name: "AI Interview", path: "/ai-interview/",  icon: Sparkles,       badge: "AI" },
    ],
  },
  {
    label: "Academics",
    items: [
      { name: "Aptitude",     path: "/apti",  icon: BrainCircuit },
      { name: "Notes",        path: "/notes", icon: NotebookText },
      { name: "DSA Sheet",    path: "/dsa",   icon: Code2 },
    ],
  },
  {
    label: "Admin",
    items: [
      { name: "Admin Dashboard", path: "/admin", icon: LayoutDashboard },
      { name: "Register",        path: "/register", icon: LogIn },
    ],
  },
];

/* ── single nav item ── */
const NavItem = ({ item, active, onClick }) => {
  const Icon = item.icon;
  return (
    <Link to={item.path} onClick={onClick}>
      <div
        className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
          transition-all duration-200 relative
          ${active
            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
            : "text-slate-400 hover:text-white hover:bg-white/8"
          }`}
      >
        <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors
          ${active ? "bg-white/20" : "bg-white/5 group-hover:bg-white/10"}`}>
          <Icon size={16} />
        </div>

        <span className="flex-1 truncate">{item.name}</span>

        {item.badge && (
          <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md
            ${item.badge === "AI"
              ? "bg-violet-500/30 text-violet-300 border border-violet-500/30"
              : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
            }`}>
            {item.badge}
          </span>
        )}

        {active && (
          <ChevronRight size={13} className="text-white/60 flex-shrink-0" />
        )}
      </div>
    </Link>
  );
};

/* ── mobile nav item ── */
const MobileNavItem = ({ item, active, onClick }) => {
  const Icon = item.icon;
  return (
    <Link to={item.path} onClick={onClick}>
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
        ${active ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-white/8 hover:text-white"}`}>
        <Icon size={17} />
        <span className="flex-1">{item.name}</span>
        {item.badge && (
          <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-md
            ${item.badge === "AI" ? "bg-violet-500/30 text-violet-300" : "bg-emerald-500/20 text-emerald-400"}`}>
            {item.badge}
          </span>
        )}
      </div>
    </Link>
  );
};

/* ══════════════════════════════════════════ */
const Sidebar = ({ open, setOpen }) => {
  const location = useLocation();
  const allItems = menuGroups.flatMap(g => g.items);

  return (
    <>
      {/* ── MOBILE TOP BAR ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50
        flex items-center justify-between px-4 py-3
        bg-slate-900/95 backdrop-blur-md border-b border-white/8 shadow-xl">

        {/* logo */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/40">
            <Rocket size={14} className="text-white" />
          </div>
          <span className="font-bold text-white text-base tracking-tight">
            Edu<span className="text-blue-400">Launch</span>
          </span>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/8 text-slate-300 hover:text-white hover:bg-white/15 transition-colors"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* ── MOBILE DRAWER ── */}
      <div className={`md:hidden fixed inset-0 z-40 transition-all duration-300
        ${open ? "pointer-events-auto" : "pointer-events-none"}`}>

        {/* backdrop */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300
            ${open ? "opacity-100" : "opacity-0"}`}
          onClick={() => setOpen(false)}
        />

        {/* drawer panel */}
        <div className={`absolute top-0 left-0 h-full w-72 bg-slate-900 border-r border-white/8
          shadow-2xl transition-transform duration-300 ease-out overflow-y-auto
          ${open ? "translate-x-0" : "-translate-x-full"}`}>

          {/* drawer header */}
          <div className="flex items-center justify-between px-5 py-5 border-b border-white/8">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/40">
                <Rocket size={16} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-white text-base leading-none">
                  Edu<span className="text-blue-400">Launch</span>
                </p>
                <p className="text-slate-500 text-[10px] mt-0.5">Student Platform</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/8 text-slate-400 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* mobile menu groups */}
          <div className="px-3 py-4 space-y-6">
            {menuGroups.map((group) => (
              <div key={group.label}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 px-4 mb-2">
                  {group.label}
                </p>
                <div className="space-y-0.5">
                  {group.items.map((item) => (
                    <MobileNavItem
                      key={item.path}
                      item={item}
                      active={location.pathname === item.path}
                      onClick={() => setOpen(false)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* mobile bottom card */}
          <div className="mx-3 mb-4 p-4 rounded-2xl bg-gradient-to-br from-blue-600/20 to-violet-600/20 border border-blue-500/20">
            <p className="text-white text-xs font-semibold mb-1">🎯 Placement Ready?</p>
            <p className="text-slate-400 text-[11px] leading-relaxed mb-3">
              Complete your profile and start applying to top companies today.
            </p>
            <Link to="/profile" onClick={() => setOpen(false)}>
              <button className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-2 rounded-xl transition-colors">
                Complete Profile
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── DESKTOP SIDEBAR ── */}
      <div className="hidden md:flex fixed left-0 top-0 h-screen w-64 flex-col
        bg-slate-900 border-r border-white/6 z-30">

        {/* logo */}
        <div className="flex items-center gap-3 px-5 py-6 border-b border-white/6">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/40 flex-shrink-0">
            <Rocket size={18} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-white text-lg leading-none tracking-tight">
              Edu<span className="text-blue-400">Launch</span>
            </p>
            <p className="text-slate-500 text-[10px] mt-0.5 tracking-wide">Student Platform</p>
          </div>
        </div>

        {/* nav groups — scrollable */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-none">
          {menuGroups.map((group) => (
            <div key={group.label}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 px-3 mb-2">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavItem
                    key={item.path}
                    item={item}
                    active={location.pathname === item.path || location.pathname.startsWith(item.path + "/")}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        

          {/* user avatar strip */}
          <div className="flex items-center gap-3 mt-3 px-2 py-2.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              S
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">Student</p>
              <p className="text-slate-500 text-[10px] truncate">student@edlaunch.in</p>
            </div>
            <ChevronRight size={13} className="text-slate-600 flex-shrink-0" />
          </div>
        </div>
     
    </>
  );
};

export default Sidebar;