import { useState, useRef } from "react";


const OPENROUTER_BASE = "https://openrouter.ai/api/v1/chat/completions";
const MODELS = ["gryphe/mythomax-l2-13b", "nousresearch/nous-capybara-7b"];

const callAI = async (prompt, maxTokens = 1000) => {
  const errors = [];
  for (let model of MODELS) {
    try {
      const res = await fetch(OPENROUTER_BASE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": "http://localhost:5173",
          "X-Title": "Chat App",
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
          max_tokens: maxTokens,
        }),
      });
      if (!res.ok) {
        const t = await res.text();
        errors.push(`${model} — HTTP ${res.status}: ${t.slice(0, 80)}`);
        continue;
      }
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content || "";
      if (!content) { errors.push(`${model} — empty response`); continue; }
      return content;
    } catch (err) {
      errors.push(`${model} — ${err.message}`);
    }
  }
  throw new Error(errors.join("\n"));
};

const scoreColor = (s) => {
  if (s >= 80) return { text: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/30", hex: "#34d399" };
  if (s >= 60) return { text: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/30", hex: "#fbbf24" };
  return { text: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/30", hex: "#f87171" };
};

const scoreLabel = (s) => (s >= 80 ? "Strong" : s >= 60 ? "Moderate" : "Needs Work");

const ScoreRing = ({ score }) => {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  const { hex } = scoreColor(score);
  return (
    <div className="relative w-28 h-28 shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <circle cx="60" cy="60" r={r} fill="none" stroke={hex} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={`${fill} ${circ}`}
          style={{ filter: `drop-shadow(0 0 6px ${hex}88)`, transition: "stroke-dasharray 1s cubic-bezier(.22,1,.36,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-bold text-3xl leading-none" style={{ color: hex, fontFamily: "'Syne', sans-serif" }}>{score}</span>
        <span className="text-xs text-slate-500 mt-0.5">/ 100</span>
      </div>
    </div>
  );
};

const Bar = ({ name, score }) => {
  const { hex, text } = scoreColor(score);
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm font-semibold text-slate-200">{name}</span>
        <span className={`text-xs font-bold ${text}`}>{score}%</span>
      </div>
      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%`, background: hex, boxShadow: `0 0 8px ${hex}66` }} />
      </div>
    </div>
  );
};

const RecDot = ({ priority }) => {
  const map = {
    high: "bg-red-400/15 text-red-400",
    medium: "bg-amber-400/15 text-amber-400",
    low: "bg-emerald-400/15 text-emerald-400",
  };
  const label = { high: "!", medium: "~", low: "✓" };
  return (
    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${map[priority] || map.low}`}>
      {label[priority] || "·"}
    </div>
  );
};

export default function ATSChecker() {
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef();

  const handleFile = (f) => {
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) { alert("File too large (max 5MB)"); return; }
    setFile(f);
    setResult(null);
    setError("");
    const reader = new FileReader();
    reader.onload = (e) => setResumeText(e.target.result);
    reader.readAsText(f);
  };

  const clearFile = () => {
    setFile(null); setResumeText(""); setResult(null); setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const runCheck = async () => {
    if (!file) return;
    setLoading(true); setResult(null); setError("");

    try {
      const textToSend = resumeText || `[File: ${file.name}]`;
      const resumeSnippet = textToSend.slice(0, 3000);
      const jdSnippet = jd.slice(0, 1500);

      // ── Step 1: Overall score + verdict ─────────────────────────────────
      setLoadingStep("Scoring your resume…");
      const scorePrompt = `You are an ATS expert. Analyse this resume${jd ? " against the job description" : ""} and reply ONLY with a JSON object, no markdown.

Resume: ${resumeSnippet}
${jd ? `Job Description: ${jdSnippet}` : ""}

JSON format:
{"overallScore":<0-100>,"verdict":"<one sentence>","formatting":<0-100>,"keywords":<0-100>,"readability":<0-100>,"impact":<0-100>}`;

      const scoreRaw = await callAI(scorePrompt, 250);
      const scoreMatch = scoreRaw.match(/\{[\s\S]*?\}/);
      if (!scoreMatch) throw new Error("Could not parse score response.");
      const scores = JSON.parse(scoreMatch[0]);

      // ── Step 2: Keywords ─────────────────────────────────────────────────
      setLoadingStep("Extracting keywords…");
      const kwPrompt = `List keywords from this resume${jd ? " and identify gaps from the job description" : ""}. Reply ONLY with JSON, no markdown.

Resume: ${resumeSnippet}
${jd ? `Job Description: ${jdSnippet}` : ""}

JSON format:
{"foundKeywords":["kw1","kw2"],"missingKeywords":["kw1","kw2"]}`;

      let keywords = { foundKeywords: [], missingKeywords: [] };
      try {
        const kwRaw = await callAI(kwPrompt, 300);
        const kwMatch = kwRaw.match(/\{[\s\S]*?\}/);
        if (kwMatch) keywords = JSON.parse(kwMatch[0]);
      } catch { /* non-fatal */ }

      // ── Step 3: Recommendations ──────────────────────────────────────────
      setLoadingStep("Generating recommendations…");
      const recPrompt = `Give 4 actionable ATS resume improvements. Reply ONLY with a JSON array, no markdown.

Resume snippet: ${resumeSnippet.slice(0, 1500)}

JSON format:
[{"priority":"high"|"medium"|"low","text":"<advice>"}]`;

      let recommendations = [];
      try {
        const recRaw = await callAI(recPrompt, 400);
        const recMatch = recRaw.match(/\[[\s\S]*?\]/);
        if (recMatch) recommendations = JSON.parse(recMatch[0]);
      } catch { /* non-fatal */ }

      setResult({
        overallScore: scores.overallScore,
        verdict: scores.verdict,
        categories: [
          { name: "Formatting", score: scores.formatting },
          { name: "Keywords",   score: scores.keywords   },
          { name: "Readability",score: scores.readability},
          { name: "Impact",     score: scores.impact     },
        ],
        foundKeywords: keywords.foundKeywords || [],
        missingKeywords: keywords.missingKeywords || [],
        recommendations,
      });

    } catch (err) {
      setError(err.message || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
      setLoadingStep("");
    }
  };

  const step = !file ? 1 : !result ? 2 : 3;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=Mulish:wght@400;500;600&display=swap');
        body { font-family: 'Mulish', sans-serif; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
        .fade-up { animation: fadeUp 0.45s ease both; }
        .spinner { animation: spin 0.7s linear infinite; }
        .pulse-dot { animation: pulse 2s ease infinite; }
      `}</style>

      <div className="max-w-2xl mx-auto px-4 py-12 pb-20">

        {/* Header */}
        <div className="fade-up mb-10">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-2 h-2 rounded-full bg-violet-500 pulse-dot" style={{ boxShadow: "0 0 10px #7c3aed" }} />
            <span className="text-xs font-semibold tracking-widest uppercase text-slate-500">AI-Powered</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-slate-100 to-slate-400 mb-2"
            style={{ fontFamily: "'Syne', sans-serif" }}>
            ATS Resume Checker
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Upload your resume and instantly get an ATS compatibility score with actionable improvements.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-2 mb-8 fade-up" style={{ animationDelay: "0.05s" }}>
          {["Upload", "Analyse", "Results"].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider
                ${step > i ? "text-violet-400" : step === i + 1 ? "text-slate-200" : "text-slate-600"}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border transition-all
                  ${step > i ? "bg-violet-500 border-violet-500 text-white" :
                    step === i + 1 ? "border-slate-500 text-slate-300" : "border-slate-700 text-slate-600"}`}>
                  {step > i ? "✓" : i + 1}
                </div>
                {s}
              </div>
              {i < 2 && <div className={`h-px w-6 transition-colors ${step > i + 1 ? "bg-violet-500" : "bg-slate-700"}`} />}
            </div>
          ))}
        </div>

        {/* Upload Card */}
        <div className="bg-slate-900 border border-white/[0.07] rounded-2xl p-5 mb-3 fade-up" style={{ animationDelay: "0.1s" }}>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">Resume</p>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
            onClick={() => !file && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
              ${dragOver ? "border-violet-500 bg-violet-500/5" : "border-white/10 hover:border-white/20 hover:bg-white/[0.02]"}
              ${!file ? "cursor-pointer" : ""}`}
          >
            <input ref={fileInputRef} type="file" accept=".pdf,.docx,.txt,.doc" className="hidden"
              onChange={(e) => handleFile(e.target.files[0])} />

            <div className="w-12 h-12 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-3">
              <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
              </svg>
            </div>

            {!file ? (
              <>
                <p className="text-sm font-semibold text-slate-300">Drop your resume here or click to browse</p>
                <p className="text-xs text-slate-600 mt-1">PDF, DOCX, TXT — max 5MB</p>
              </>
            ) : (
              <div onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/25 rounded-full px-3 py-1.5 text-sm font-medium text-violet-300">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                </svg>
                <span className="max-w-xs truncate">{file.name}</span>
                <button onClick={clearFile} className="text-slate-500 hover:text-red-400 transition-colors text-base leading-none ml-1">×</button>
              </div>
            )}
          </div>
        </div>

        {/* JD Card */}
        <div className="bg-slate-900 border border-white/[0.07] rounded-2xl p-5 mb-3 fade-up" style={{ animationDelay: "0.15s" }}>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">
            Job Description <span className="normal-case tracking-normal font-normal text-slate-700">(optional)</span>
          </p>
          <textarea
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder="Paste the job description here for keyword gap analysis..."
            className="w-full min-h-[90px] resize-y bg-slate-950 border border-white/[0.07] rounded-xl px-3.5 py-3 text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-violet-500/50 transition-colors leading-relaxed"
          />
        </div>

        {/* Analyse Button */}
        <button
          onClick={runCheck}
          disabled={!file || loading}
          className="w-full py-3.5 rounded-xl font-semibold text-sm tracking-wide flex items-center justify-center gap-2 transition-all duration-150 fade-up disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-600"
          style={{
            animationDelay: "0.2s",
            background: !file || loading ? undefined : "linear-gradient(135deg, #7c3aed, #a78bfa)",
            boxShadow: !file || loading ? "none" : "0 0 24px rgba(124,58,237,0.35)",
            color: !file || loading ? undefined : "#fff",
          }}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-500 border-t-slate-300 rounded-full spinner" />
              {loadingStep || "Analysing resume…"}
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              Analyse Resume
            </>
          )}
        </button>

        {/* Error */}
        {error && (
          <div className="mt-3 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3 text-sm text-red-400 whitespace-pre-line">
            {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="mt-6 space-y-3 fade-up">

            {/* Score Card */}
            <div className="bg-slate-900 border border-white/[0.07] rounded-2xl p-5">
              <div className="flex items-center gap-5">
                <ScoreRing score={result.overallScore} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <h2 className="text-lg font-bold text-slate-100" style={{ fontFamily: "'Syne', sans-serif" }}>ATS Score</h2>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border
                      ${scoreColor(result.overallScore).bg} ${scoreColor(result.overallScore).text} ${scoreColor(result.overallScore).border}`}>
                      {scoreLabel(result.overallScore)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">{result.verdict}</p>
                </div>
              </div>
            </div>

            {/* Category Bars */}
            <div className="bg-slate-900 border border-white/[0.07] rounded-2xl p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">Breakdown</p>
              {result.categories.map((c) => <Bar key={c.name} name={c.name} score={c.score} />)}
            </div>

            {/* Keywords */}
            {(result.foundKeywords?.length > 0 || result.missingKeywords?.length > 0) && (
              <div className="bg-slate-900 border border-white/[0.07] rounded-2xl p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">Keyword Analysis</p>
                {result.foundKeywords?.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-slate-600 mb-2">Found in resume</p>
                    <div className="flex flex-wrap gap-2">
                      {result.foundKeywords.map((k) => (
                        <span key={k} className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/25 text-emerald-400">{k}</span>
                      ))}
                    </div>
                  </div>
                )}
                {result.missingKeywords?.length > 0 && (
                  <div>
                    <p className="text-xs text-slate-600 mb-2">Missing / suggested</p>
                    <div className="flex flex-wrap gap-2">
                      {result.missingKeywords.map((k) => (
                        <span key={k} className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-400/10 border border-red-400/25 text-red-400">{k}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Recommendations */}
            {result.recommendations?.length > 0 && (
              <div className="bg-slate-900 border border-white/[0.07] rounded-2xl p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">Recommendations</p>
                <div className="divide-y divide-white/[0.05]">
                  {result.recommendations.map((rec, i) => (
                    <div key={i} className="flex gap-3 items-start py-3 first:pt-0 last:pb-0">
                      <RecDot priority={rec.priority} />
                      <p className="text-sm text-slate-300 leading-relaxed">{rec.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reset */}
            <button
              onClick={clearFile}
              className="w-full py-3 rounded-xl border border-white/[0.07] text-sm font-semibold text-slate-500 hover:text-slate-200 hover:border-white/15 transition-colors bg-transparent"
            >
              Check another resume
            </button>
          </div>
        )}
      </div>
    </div>
  );
}