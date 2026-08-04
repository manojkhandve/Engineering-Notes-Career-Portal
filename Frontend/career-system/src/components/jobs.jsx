import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase, MapPin, Clock, Heart, AlertCircle,
  Search, SlidersHorizontal, ChevronLeft, ChevronRight,
  X, Building2, Zap, TrendingUp, Filter, RotateCcw,
  BookmarkCheck
} from "lucide-react";

const BASE_URL = "http://localhost:8180/api";

async function apiFetch(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return await res.json();
}

// ── Skeleton Loader ───────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="job-card skeleton-card">
      <div className="sk sk-title" />
      <div className="sk sk-sub" />
      <div className="sk-tags">
        <div className="sk sk-tag" />
        <div className="sk sk-tag" />
      </div>
      <div className="sk-meta">
        <div className="sk sk-meta-item" />
        <div className="sk sk-meta-item" />
      </div>
    </div>
  );
}

// ── JobCard ───────────────────────────────────────────────────────────────────
function JobCard({ job, saved, onSave, index }) {
  const navigate = useNavigate();

  const typeColor = {
    "Full-time": { bg: "#EFF6FF", color: "#2563EB" },
    "Part-time": { bg: "#F5F3FF", color: "#7C3AED" },
    "Contract":  { bg: "#FFF7ED", color: "#C2410C" },
    "Remote":    { bg: "#ECFDF5", color: "#065F46" },
    "Internship":{ bg: "#FDF4FF", color: "#86198F" },
  };
  const tc = typeColor[job.type] || { bg: "#F3F4F6", color: "#374151" };

  return (
    <div
      className="job-card"
      style={{ animationDelay: `${index * 60}ms` }}
      onClick={() => navigate(`/job/${job.id}`)}
    >
      {/* Save */}
      <button
        className={`save-btn ${saved ? "saved" : ""}`}
        onClick={(e) => { e.stopPropagation(); onSave(job.id); }}
        title={saved ? "Unsave" : "Save job"}
      >
        <Heart size={15} fill={saved ? "currentColor" : "none"} />
      </button>

      {/* Company + Title */}
      <div className="card-header">
        <div className="company-avatar">
          {job.company?.charAt(0) ?? "C"}
        </div>
        <div>
          <h3 className="job-title">{job.title}</h3>
          <p className="company-name">
            <Building2 size={11} style={{ display: "inline", marginRight: 4 }} />
            {job.company}
          </p>
        </div>
      </div>

      {/* Tags */}
      <div className="card-tags">
        <span className="tag" style={{ background: tc.bg, color: tc.color }}>
          {job.type}
        </span>
        <span className="tag tag-salary">₹ {job.packageValue}</span>
      </div>

      {/* Meta */}
      <div className="card-meta">
        <span><Briefcase size={11} /> {job.experience}</span>
        <span><MapPin size={11} /> {job.location}</span>
        <span><Clock size={11} /> {job.posted}</span>
      </div>

      {/* Footer */}
      <div className="card-footer">
        <span className={`days-left ${job.daysLeft <= 3 ? "urgent" : ""}`}>
          {job.daysLeft <= 3 && <Zap size={10} />}
          {job.daysLeft} days left
        </span>
        <button
          className="apply-btn"
          onClick={(e) => { e.stopPropagation(); }}
        >
          Apply Now →
        </button>
      </div>
    </div>
  );
}

// ── Filter Panel ──────────────────────────────────────────────────────────────
function FilterPanel({ filters, setFilters, jobs, onClose }) {
  const types      = [...new Set(jobs.map(j => j.type).filter(Boolean))];
  const locations  = [...new Set(jobs.map(j => j.location).filter(Boolean))];
  const expOptions = [...new Set(jobs.map(j => j.experience).filter(Boolean))];

  const toggle = (key, val) => {
    setFilters(prev => {
      const arr = prev[key] || [];
      return {
        ...prev,
        [key]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val],
      };
    });
  };

  const activeCount =
    (filters.types?.length || 0) +
    (filters.locations?.length || 0) +
    (filters.experience?.length || 0);

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <span className="filter-title">
          <Filter size={14} /> Filters
          {activeCount > 0 && <span className="filter-badge">{activeCount}</span>}
        </span>
        <div className="filter-actions">
          {activeCount > 0 && (
            <button className="clear-btn" onClick={() => setFilters({})}>
              <RotateCcw size={12} /> Clear all
            </button>
          )}
          <button className="close-filter-btn" onClick={onClose}>
            <X size={14} />
          </button>
        </div>
      </div>

      <FilterGroup
        label="Job Type"
        options={types}
        selected={filters.types || []}
        onToggle={(v) => toggle("types", v)}
      />
      <FilterGroup
        label="Location"
        options={locations}
        selected={filters.locations || []}
        onToggle={(v) => toggle("locations", v)}
      />
      <FilterGroup
        label="Experience"
        options={expOptions}
        selected={filters.experience || []}
        onToggle={(v) => toggle("experience", v)}
      />
    </div>
  );
}

function FilterGroup({ label, options, selected, onToggle }) {
  return (
    <div className="filter-group">
      <p className="filter-group-label">{label}</p>
      <div className="filter-chips">
        {options.map(opt => (
          <button
            key={opt}
            className={`filter-chip ${selected.includes(opt) ? "active" : ""}`}
            onClick={() => onToggle(opt)}
          >
            {selected.includes(opt) && <span className="chip-check">✓</span>}
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Pagination ────────────────────────────────────────────────────────────────
function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 || i === totalPages ||
      (i >= page - 1 && i <= page + 1)
    ) pages.push(i);
    else if (pages[pages.length - 1] !== "…") pages.push("…");
  }

  return (
    <div className="pagination">
      <button
        className="page-btn nav"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
      >
        <ChevronLeft size={15} />
      </button>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="page-ellipsis">…</span>
        ) : (
          <button
            key={p}
            className={`page-btn ${p === page ? "active" : ""}`}
            onClick={() => onChange(p)}
          >
            {p}
          </button>
        )
      )}

      <button
        className="page-btn nav"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
      >
        <ChevronRight size={15} />
      </button>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
const JOBS_PER_PAGE = 9;

const Jobs = () => {
  const [jobs, setJobs]         = useState([]);
  const [savedIds, setSavedIds] = useState(new Set());
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [search, setSearch]     = useState("");
  const [filters, setFilters]   = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage]         = useState(1);
  const [sortBy, setSortBy]     = useState("newest");

  const fetchJobs = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const data = await apiFetch("/jobs");
      setJobs(data);
    } catch {
      setError("Failed to load jobs. Please check backend (port 8180).");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  // Reset page on search/filter change
  useEffect(() => { setPage(1); }, [search, filters, sortBy]);

  const toggleSave = (jobId) => {
    setSavedIds(prev => {
      const next = new Set(prev);
      next.has(jobId) ? next.delete(jobId) : next.add(jobId);
      return next;
    });
  };

  const activeFilterCount =
    (filters.types?.length || 0) +
    (filters.locations?.length || 0) +
    (filters.experience?.length || 0);

  // Filter + search + sort
  const filtered = useMemo(() => {
    let list = [...jobs];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(j =>
        j.title?.toLowerCase().includes(q) ||
        j.company?.toLowerCase().includes(q) ||
        j.location?.toLowerCase().includes(q)
      );
    }

    if (filters.types?.length)
      list = list.filter(j => filters.types.includes(j.type));
    if (filters.locations?.length)
      list = list.filter(j => filters.locations.includes(j.location));
    if (filters.experience?.length)
      list = list.filter(j => filters.experience.includes(j.experience));

    if (sortBy === "salary")
      list.sort((a, b) => (b.packageValue || "").localeCompare(a.packageValue || ""));
    else if (sortBy === "deadline")
      list.sort((a, b) => (a.daysLeft || 0) - (b.daysLeft || 0));

    return list;
  }, [jobs, search, filters, sortBy]);

  const totalPages = Math.ceil(filtered.length / JOBS_PER_PAGE);
  const paginated  = filtered.slice((page - 1) * JOBS_PER_PAGE, page * JOBS_PER_PAGE);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Manrope:wght@400;500;600&display=swap');

        :root {
          --ink: #0D1117;
          --ink2: #3B4451;
          --ink3: #6B7585;
          --surface: #FFFFFF;
          --surface2: #F7F8FA;
          --surface3: #EFF1F5;
          --border: #E4E7ED;
          --accent: #0057FF;
          --accent-light: #EBF1FF;
          --accent-hover: #0042CC;
          --green: #059669;
          --green-light: #ECFDF5;
          --red: #DC2626;
          --red-light: #FEF2F2;
          --amber: #D97706;
          --amber-light: #FFFBEB;
          --radius: 14px;
          --radius-sm: 8px;
          --shadow: 0 1px 3px rgba(0,0,0,.06), 0 4px 16px rgba(0,0,0,.06);
          --shadow-hover: 0 2px 8px rgba(0,0,0,.08), 0 12px 40px rgba(0,87,255,.12);
          --ff-head: 'Syne', sans-serif;
          --ff-body: 'Manrope', sans-serif;
        }

        .jobs-page {
          margin-left: 0;
          padding: 32px 24px 64px;
          min-height: 100vh;
          background: var(--surface2);
          font-family: var(--ff-body);
          color: var(--ink);
        }
        @media(min-width:1024px){ .jobs-page { margin-left: 256px; } }

        /* ── Header ── */
        .page-header { margin-bottom: 28px; }
        .header-top { display:flex; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; gap:12px; margin-bottom: 6px; }
        .page-title { font-family: var(--ff-head); font-size: 26px; font-weight: 800; color: var(--ink); letter-spacing: -0.5px; display:flex; align-items:center; gap:10px; }
        .page-title-dot { width:8px; height:8px; border-radius:50%; background: var(--accent); display:inline-block; }
        .page-sub { color: var(--ink3); font-size: 13.5px; }
        .stats-row { display:flex; gap:20px; margin-top:18px; flex-wrap:wrap; }
        .stat-pill { display:flex; align-items:center; gap:6px; background:var(--surface); border:1px solid var(--border); border-radius:50px; padding:6px 14px; font-size:12px; color:var(--ink2); font-weight:500; }
        .stat-pill svg { color: var(--accent); }

        /* ── Controls ── */
        .controls-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .search-wrap {
          position: relative;
          flex: 1;
          min-width: 200px;
        }
        .search-icon {
          position: absolute;
          left: 13px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--ink3);
          pointer-events: none;
        }
        .search-input {
          width: 100%;
          padding: 10px 12px 10px 38px;
          border: 1.5px solid var(--border);
          border-radius: var(--radius-sm);
          font-family: var(--ff-body);
          font-size: 13.5px;
          background: var(--surface);
          color: var(--ink);
          transition: border-color .2s, box-shadow .2s;
          outline: none;
          box-sizing: border-box;
        }
        .search-input:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(0,87,255,.1);
        }
        .search-input::placeholder { color: var(--ink3); }
        .search-clear {
          position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
          background: var(--surface3); border: none; border-radius: 50%;
          width: 20px; height: 20px; display:flex; align-items:center; justify-content:center;
          cursor: pointer; color: var(--ink3);
        }
        .filter-toggle-btn {
          position: relative;
          display: flex; align-items: center; gap: 7px;
          padding: 10px 16px;
          background: var(--surface);
          border: 1.5px solid var(--border);
          border-radius: var(--radius-sm);
          font-family: var(--ff-body);
          font-size: 13px;
          font-weight: 600;
          color: var(--ink2);
          cursor: pointer;
          transition: border-color .2s, background .2s;
          white-space: nowrap;
        }
        .filter-toggle-btn:hover, .filter-toggle-btn.active {
          border-color: var(--accent);
          background: var(--accent-light);
          color: var(--accent);
        }
        .filter-count-badge {
          background: var(--accent);
          color: #fff;
          border-radius: 50px;
          font-size: 10px;
          font-weight: 700;
          padding: 1px 6px;
          min-width: 18px;
          text-align: center;
        }
        .sort-select {
          padding: 10px 30px 10px 12px;
          border: 1.5px solid var(--border);
          border-radius: var(--radius-sm);
          font-family: var(--ff-body);
          font-size: 13px;
          font-weight: 500;
          color: var(--ink2);
          background: var(--surface) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7585' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E") no-repeat right 10px center;
          -webkit-appearance: none;
          cursor: pointer;
          outline: none;
          transition: border-color .2s;
        }
        .sort-select:focus { border-color: var(--accent); }

        /* ── Filter Panel ── */
        .filter-panel-wrap {
          overflow: hidden;
          transition: max-height .35s cubic-bezier(.4,0,.2,1), opacity .3s;
          max-height: 0;
          opacity: 0;
          margin-bottom: 0;
        }
        .filter-panel-wrap.open {
          max-height: 600px;
          opacity: 1;
          margin-bottom: 20px;
        }
        .filter-panel {
          background: var(--surface);
          border: 1.5px solid var(--border);
          border-radius: var(--radius);
          padding: 20px 20px 16px;
        }
        .filter-header {
          display:flex; align-items:center; justify-content:space-between;
          margin-bottom: 16px;
        }
        .filter-title {
          font-family: var(--ff-head);
          font-size: 14px;
          font-weight: 700;
          color: var(--ink);
          display:flex; align-items:center; gap:7px;
        }
        .filter-badge {
          background: var(--accent);
          color: #fff;
          border-radius: 50px;
          font-size: 10px;
          font-weight: 700;
          padding: 1px 7px;
        }
        .filter-actions { display:flex; align-items:center; gap:8px; }
        .clear-btn {
          display:flex; align-items:center; gap:5px;
          background:none; border: 1px solid var(--border);
          border-radius: 50px; padding: 4px 10px;
          font-size: 11.5px; font-family: var(--ff-body);
          color: var(--ink3); cursor: pointer;
          transition: all .2s;
        }
        .clear-btn:hover { border-color: var(--red); color: var(--red); }
        .close-filter-btn {
          background: var(--surface3); border: none; border-radius: 50%;
          width: 24px; height: 24px; display:flex; align-items:center; justify-content:center;
          cursor: pointer; color: var(--ink3);
        }
        .filter-group { margin-bottom: 14px; }
        .filter-group-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .08em;
          color: var(--ink3);
          margin-bottom: 8px;
        }
        .filter-chips { display:flex; flex-wrap:wrap; gap:6px; }
        .filter-chip {
          display:flex; align-items:center; gap:4px;
          padding: 5px 12px;
          background: var(--surface2);
          border: 1.5px solid var(--border);
          border-radius: 50px;
          font-size: 12.5px;
          font-family: var(--ff-body);
          font-weight: 500;
          color: var(--ink2);
          cursor: pointer;
          transition: all .15s;
        }
        .filter-chip:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-light); }
        .filter-chip.active { background: var(--accent); border-color: var(--accent); color: #fff; }
        .chip-check { font-size: 10px; }

        /* ── Result Bar ── */
        .result-bar {
          display:flex; align-items:center; justify-content:space-between;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 8px;
        }
        .result-count { font-size: 13px; color: var(--ink3); }
        .result-count strong { color: var(--ink); font-weight: 700; }
        .saved-toggle {
          display:flex; align-items:center; gap:5px;
          background:none; border: 1.5px solid var(--border);
          border-radius: 50px; padding: 4px 12px;
          font-size: 12px; font-family: var(--ff-body);
          color: var(--ink3); cursor: pointer;
          transition: all .2s;
        }
        .saved-toggle:hover, .saved-toggle.on {
          border-color: #DC2626; color: #DC2626; background: #FEF2F2;
        }

        /* ── Job Card ── */
        .jobs-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
        }
        @media(min-width:640px){ .jobs-grid { grid-template-columns: repeat(2, 1fr); } }
        @media(min-width:1100px){ .jobs-grid { grid-template-columns: repeat(3, 1fr); } }

        .job-card {
          position: relative;
          background: var(--surface);
          border: 1.5px solid var(--border);
          border-radius: var(--radius);
          padding: 20px;
          cursor: pointer;
          display:flex; flex-direction:column; gap:12px;
          transition: transform .22s cubic-bezier(.4,0,.2,1), box-shadow .22s, border-color .22s;
          animation: fadeUp .4s both;
        }
        @keyframes fadeUp {
          from { opacity:0; transform: translateY(14px); }
          to   { opacity:1; transform: translateY(0); }
        }
        .job-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-hover);
          border-color: rgba(0,87,255,.2);
        }
        .save-btn {
          position: absolute; top: 16px; right: 16px;
          background: none; border: none;
          color: var(--ink3); cursor: pointer;
          padding: 4px;
          border-radius: 50%;
          transition: color .2s, background .2s;
        }
        .save-btn:hover { color: #DC2626; background: #FEF2F2; }
        .save-btn.saved { color: #DC2626; }
        .card-header { display:flex; align-items:flex-start; gap:12px; padding-right:24px; }
        .company-avatar {
          width: 40px; height: 40px;
          border-radius: 10px;
          background: linear-gradient(135deg, var(--accent-light), #dbeafe);
          border: 1px solid rgba(0,87,255,.15);
          display:flex; align-items:center; justify-content:center;
          font-family: var(--ff-head);
          font-weight: 800;
          font-size: 16px;
          color: var(--accent);
          flex-shrink: 0;
          text-transform: uppercase;
        }
        .job-title {
          font-family: var(--ff-head);
          font-size: 15px;
          font-weight: 700;
          color: var(--ink);
          margin: 0 0 2px;
          line-height: 1.3;
        }
        .company-name {
          font-size: 12px;
          color: var(--ink3);
          margin:0;
          display:flex; align-items:center;
        }
        .card-tags { display:flex; flex-wrap:wrap; gap:6px; }
        .tag {
          font-size: 11.5px;
          font-weight: 600;
          padding: 3px 10px;
          border-radius: 50px;
        }
        .tag-salary {
          background: var(--green-light);
          color: var(--green);
        }
        .card-meta {
          display:flex; gap:12px; flex-wrap:wrap;
          font-size: 11.5px;
          color: var(--ink3);
        }
        .card-meta span { display:flex; align-items:center; gap:4px; }
        .card-footer {
          display:flex; align-items:center; justify-content:space-between;
          margin-top: 2px;
          border-top: 1px solid var(--border);
          padding-top: 12px;
        }
        .days-left {
          font-size: 11.5px;
          color: var(--ink3);
          display:flex; align-items:center; gap:3px;
        }
        .days-left.urgent { color: var(--amber); font-weight: 600; }
        .apply-btn {
          padding: 7px 16px;
          background: var(--accent);
          color: #fff;
          border: none;
          border-radius: var(--radius-sm);
          font-family: var(--ff-body);
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          transition: background .2s, transform .15s;
          letter-spacing: .01em;
        }
        .apply-btn:hover { background: var(--accent-hover); transform: scale(1.03); }

        /* ── Skeleton ── */
        .skeleton-card { pointer-events:none; }
        .sk {
          background: linear-gradient(90deg, var(--surface3) 25%, #e9eaed 50%, var(--surface3) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 6px;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .sk-title { height:16px; width:65%; margin-bottom:8px; }
        .sk-sub { height:12px; width:40%; }
        .sk-tags { display:flex; gap:8px; margin-top:8px; }
        .sk-tag { height:22px; width:70px; border-radius:50px; }
        .sk-meta { display:flex; gap:12px; margin-top:8px; }
        .sk-meta-item { height:12px; width:80px; }

        /* ── Error ── */
        .error-box {
          display:flex; align-items:center; gap:10px;
          background: var(--red-light);
          border: 1px solid #fecaca;
          border-radius: var(--radius-sm);
          padding: 14px 16px;
          margin-bottom: 20px;
          font-size: 13px;
          color: var(--red);
        }
        .retry-btn {
          margin-left:auto;
          padding: 5px 12px;
          background: var(--red);
          color: #fff;
          border: none;
          border-radius: 6px;
          font-size: 12px;
          font-family: var(--ff-body);
          cursor: pointer;
        }

        /* ── Empty ── */
        .empty-state {
          text-align:center;
          padding: 60px 20px;
          color: var(--ink3);
        }
        .empty-icon {
          font-size: 48px; margin-bottom: 12px;
        }
        .empty-state h3 {
          font-family: var(--ff-head);
          font-size: 18px;
          font-weight: 700;
          color: var(--ink2);
          margin-bottom: 6px;
        }
        .empty-state p { font-size: 13.5px; }
        .empty-cta {
          margin-top: 16px;
          padding: 9px 20px;
          background: var(--accent);
          color: #fff;
          border: none;
          border-radius: var(--radius-sm);
          font-family: var(--ff-body);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }

        /* ── Pagination ── */
        .pagination-wrap {
          margin-top: 36px;
          display:flex;
          flex-direction: column;
          align-items:center;
          gap: 10px;
        }
        .pagination-info { font-size:12.5px; color: var(--ink3); }
        .pagination { display:flex; align-items:center; gap:6px; }
        .page-btn {
          width: 36px; height: 36px;
          display:flex; align-items:center; justify-content:center;
          border: 1.5px solid var(--border);
          border-radius: var(--radius-sm);
          font-family: var(--ff-body);
          font-size: 13px;
          font-weight: 600;
          color: var(--ink2);
          background: var(--surface);
          cursor: pointer;
          transition: all .15s;
        }
        .page-btn:hover:not(:disabled) {
          border-color: var(--accent);
          color: var(--accent);
          background: var(--accent-light);
        }
        .page-btn.active {
          background: var(--accent);
          border-color: var(--accent);
          color: #fff;
        }
        .page-btn:disabled { opacity:.4; cursor:default; }
        .page-btn.nav { color: var(--ink3); }
        .page-ellipsis { color: var(--ink3); font-size: 14px; padding: 0 4px; }
      `}</style>

      <div className="jobs-page">
        {/* Header */}
        <div className="page-header">
          <div className="header-top">
            <div>
              <h1 className="page-title">
                <span className="page-title-dot" />
                Find Your Dream Job
              </h1>
              <p className="page-sub">Curated opportunities matched to your profile</p>
            </div>
          </div>
          <div className="stats-row">
            <div className="stat-pill">
              <TrendingUp size={13} />
              {jobs.length} open roles
            </div>
            <div className="stat-pill">
              <BookmarkCheck size={13} />
              {savedIds.size} saved
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="error-box">
            <AlertCircle size={16} />
            <span>{error}</span>
            <button className="retry-btn" onClick={fetchJobs}>Retry</button>
          </div>
        )}

        {/* Controls */}
        <div className="controls-bar">
          <div className="search-wrap">
            <Search size={15} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search job title, company, or location…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="search-clear" onClick={() => setSearch("")}>
                <X size={11} />
              </button>
            )}
          </div>

          <button
            className={`filter-toggle-btn ${showFilters ? "active" : ""}`}
            onClick={() => setShowFilters(v => !v)}
          >
            <SlidersHorizontal size={14} />
            Filters
            {activeFilterCount > 0 && (
              <span className="filter-count-badge">{activeFilterCount}</span>
            )}
          </button>

          <select
            className="sort-select"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="salary">Highest Salary</option>
            <option value="deadline">Closing Soon</option>
          </select>
        </div>

        {/* Filter Panel */}
        <div className={`filter-panel-wrap ${showFilters ? "open" : ""}`}>
          <FilterPanel
            filters={filters}
            setFilters={setFilters}
            jobs={jobs}
            onClose={() => setShowFilters(false)}
          />
        </div>

        {/* Result bar */}
        {!loading && (
          <div className="result-bar">
            <p className="result-count">
              Showing <strong>{paginated.length}</strong> of{" "}
              <strong>{filtered.length}</strong> jobs
              {search && <> for "<strong>{search}</strong>"</>}
            </p>
          </div>
        )}

        {/* Grid */}
        <div className="jobs-grid">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : paginated.map((job, i) => (
                <JobCard
                  key={job.id}
                  job={job}
                  saved={savedIds.has(job.id)}
                  onSave={toggleSave}
                  index={i}
                />
              ))}
        </div>

        {/* Empty State */}
        {!loading && filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No matching jobs found</h3>
            <p>Try adjusting your search terms or clearing filters.</p>
            <button
              className="empty-cta"
              onClick={() => { setSearch(""); setFilters({}); }}
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {!loading && filtered.length > 0 && (
          <div className="pagination-wrap">
            <p className="pagination-info">
              Page {page} of {totalPages}
            </p>
            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={p => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Jobs;