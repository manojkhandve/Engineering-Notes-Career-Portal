import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";


const OPENROUTER_BASE = "https://openrouter.ai/api/v1/chat/completions";
const MODELS = ["gryphe/mythomax-l2-13b", "nousresearch/nous-capybara-7b"];

// Call OpenRouter with model fallback
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
      return content; // ✅ success
    } catch (err) {
      errors.push(`${model} — ${err.message}`);
    }
  }
  throw new Error(errors.join("\n"));
};

const InterviewResult = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    role = "Software Engineer",
    difficulty = "intermediate",
    questions = [],
    answers = [],
    tabWarnings = 0,
  } = location.state || {};

  const [evaluation, setEvaluation] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(true);
  const [evalError, setEvalError] = useState("");
  const [expandedIdx, setExpandedIdx] = useState(null);

  useEffect(() => {
    if (!questions.length || !answers.length) {
      setIsEvaluating(false);
      return;
    }
    evaluateAnswers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const evaluateAnswers = async () => {
    setIsEvaluating(true);
    setEvalError("");

    try {
      // Evaluate each question individually to avoid token/length limits
      const results = [];
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const a = answers[i] || "(no answer given)";

        const prompt = `You are a ${role} interviewer. Evaluate this ${difficulty}-level interview answer.

Question: ${q}
Answer: ${a}

Reply with ONLY a JSON object, no markdown:
{"correct":true,"score":7,"feedback":"One sentence feedback.","modelAnswer":"One sentence ideal answer."}`;

        try {
          const raw = await callAI(prompt, 200);
          const match = raw.match(/\{[\s\S]*?\}/);
          if (match) {
            results.push(JSON.parse(match[0]));
          } else {
            results.push({ correct: false, score: 0, feedback: "Could not evaluate.", modelAnswer: "" });
          }
        } catch {
          results.push({ correct: false, score: 0, feedback: "Evaluation failed for this question.", modelAnswer: "" });
        }
      }

      // Calculate overall score from individual scores
      const avgScore = Math.round(
        results.reduce((sum, r) => sum + (r.score || 0), 0) / results.length * 10
      );

      const correctCount = results.filter((r) => r.correct).length;

      // Get short overall feedback
      const feedbackPrompt = `A ${difficulty}-level ${role} candidate answered ${correctCount} out of ${questions.length} questions correctly with an average score of ${avgScore}/100. Write 1-2 sentences of overall interview feedback.`;

      let overallFeedback = "";
      try {
        overallFeedback = await callAI(feedbackPrompt, 100);
        overallFeedback = overallFeedback.replace(/^["']|["']$/g, "").trim();
      } catch {
        overallFeedback = `Answered ${correctCount} of ${questions.length} questions correctly.`;
      }

      setEvaluation({ overallScore: avgScore, overallFeedback, results });
    } catch (err) {
      setEvalError(err.message || "Evaluation failed.");
    } finally {
      setIsEvaluating(false);
    }
  };

  const correctCount = evaluation?.results?.filter((r) => r.correct).length ?? 0;
  const totalCount = questions.length;

  const scoreColor = (s) => {
    if (s >= 75) return "text-emerald-400";
    if (s >= 50) return "text-amber-400";
    return "text-rose-400";
  };

  const scoreBg = (s) => {
    if (s >= 75) return "bg-emerald-500/10 border-emerald-500/20";
    if (s >= 50) return "bg-amber-500/10 border-amber-500/20";
    return "bg-rose-500/10 border-rose-500/20";
  };

  return (
    <div className="ml-0 md:ml-64 min-h-screen bg-slate-950 p-6">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;700&family=Mulish:wght@400;500;600&display=swap');
        .font-display{font-family:'Bricolage Grotesque',sans-serif}
        .font-body{font-family:'Mulish',sans-serif}
        @keyframes spin{to{transform:rotate(360deg)}}
        .spin{animation:spin 0.8s linear infinite}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .fade-in{animation:fadeIn 0.4s ease both}
        .result-card{transition:all 0.2s ease}
      `}</style>

      <div className="font-body max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8 fade-in">
          <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-1">Session complete</p>
          <h1 className="font-display text-white text-2xl leading-tight mb-1">{role} Interview Results</h1>
          <p className="text-slate-500 text-sm capitalize">{difficulty} level · {totalCount} questions</p>
        </div>

        {/* Evaluating */}
        {isEvaluating && (
          <div className="bg-slate-900 border border-white/[0.07] rounded-2xl p-8 flex items-center gap-4 mb-6 fade-in">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full spin flex-shrink-0" />
            <div>
              <p className="text-slate-200 text-sm font-semibold">Evaluating your answers…</p>
              <p className="text-slate-500 text-xs mt-0.5">Reviewing each response one by one</p>
            </div>
          </div>
        )}

        {/* Eval Error */}
        {evalError && (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-5 mb-6 fade-in">
            <p className="text-rose-400 text-sm font-semibold">Could not evaluate answers</p>
            <p className="text-slate-500 text-xs mt-1 whitespace-pre-line">{evalError}</p>
            <button
              onClick={evaluateAnswers}
              className="mt-3 px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-xs hover:bg-indigo-500 transition-colors"
            >
              Retry evaluation
            </button>
          </div>
        )}

        {/* Score Summary */}
        {evaluation && !isEvaluating && (
          <>
            <div className="grid grid-cols-3 gap-3 mb-6 fade-in">
              <div className={`col-span-1 rounded-2xl border p-5 text-center ${scoreBg(evaluation.overallScore)}`}>
                <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-1">Overall score</p>
                <p className={`text-4xl font-display font-bold ${scoreColor(evaluation.overallScore)}`}>
                  {evaluation.overallScore}
                </p>
                <p className="text-slate-500 text-xs mt-0.5">/ 100</p>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-slate-900 p-5 text-center">
                <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-1">Correct</p>
                <p className="text-4xl font-display font-bold text-emerald-400">{correctCount}</p>
                <p className="text-slate-500 text-xs mt-0.5">/ {totalCount}</p>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-slate-900 p-5 text-center">
                <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-1">Integrity</p>
                <p className={`text-4xl font-display font-bold ${tabWarnings > 0 ? "text-rose-400" : "text-emerald-400"}`}>
                  {tabWarnings > 0 ? tabWarnings : "✓"}
                </p>
                <p className="text-slate-500 text-xs mt-0.5">
                  {tabWarnings > 0 ? "tab switch" + (tabWarnings > 1 ? "es" : "") : "clean"}
                </p>
              </div>
            </div>

            {/* Overall feedback */}
            {evaluation.overallFeedback && (
              <div className="bg-slate-900 border border-white/[0.07] rounded-2xl p-5 mb-6 fade-in">
                <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-2">Summary</p>
                <p className="text-slate-300 text-sm leading-relaxed">{evaluation.overallFeedback}</p>
              </div>
            )}

            {/* Correct answers */}
            {correctCount > 0 && (
              <div className="mb-4 fade-in">
                <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-3">
                  ✓ Questions answered correctly ({correctCount})
                </p>
                <div className="flex flex-col gap-2">
                  {evaluation.results.map((r, i) =>
                    r.correct ? (
                      <div
                        key={i}
                        className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl px-4 py-3 flex items-start gap-3 cursor-pointer result-card hover:bg-emerald-500/10"
                        onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
                      >
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold mt-0.5">✓</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-200 text-sm font-semibold">{questions[i]}</p>
                          {expandedIdx === i && (
                            <div className="mt-3 space-y-2 fade-in">
                              <div>
                                <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Your answer</p>
                                <p className="text-slate-400 text-xs leading-relaxed">{answers[i]}</p>
                              </div>
                              <div>
                                <p className="text-xs text-emerald-500 uppercase tracking-widest mb-1">Feedback</p>
                                <p className="text-slate-300 text-xs leading-relaxed">{r.feedback}</p>
                              </div>
                              {r.modelAnswer && (
                                <div>
                                  <p className="text-xs text-indigo-400 uppercase tracking-widest mb-1">Model answer</p>
                                  <p className="text-slate-300 text-xs leading-relaxed">{r.modelAnswer}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <span className="flex-shrink-0 text-emerald-400 font-bold text-sm">{r.score}/10</span>
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            )}

            {/* Needs improvement */}
            {evaluation.results.some((r) => !r.correct) && (
              <div className="mb-6 fade-in">
                <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-3">
                  ✗ Needs improvement ({evaluation.results.filter((r) => !r.correct).length})
                </p>
                <div className="flex flex-col gap-2">
                  {evaluation.results.map((r, i) =>
                    !r.correct ? (
                      <div
                        key={i}
                        className="bg-rose-500/5 border border-rose-500/20 rounded-xl px-4 py-3 flex items-start gap-3 cursor-pointer result-card hover:bg-rose-500/10"
                        onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
                      >
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-xs font-bold mt-0.5">✗</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-200 text-sm font-semibold">{questions[i]}</p>
                          {expandedIdx === i && (
                            <div className="mt-3 space-y-2 fade-in">
                              <div>
                                <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Your answer</p>
                                <p className="text-slate-400 text-xs leading-relaxed">{answers[i] || "(no answer given)"}</p>
                              </div>
                              <div>
                                <p className="text-xs text-rose-400 uppercase tracking-widest mb-1">Feedback</p>
                                <p className="text-slate-300 text-xs leading-relaxed">{r.feedback}</p>
                              </div>
                              {r.modelAnswer && (
                                <div>
                                  <p className="text-xs text-indigo-400 uppercase tracking-widest mb-1">Model answer</p>
                                  <p className="text-slate-300 text-xs leading-relaxed">{r.modelAnswer}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <span className="flex-shrink-0 text-rose-400 font-bold text-sm">{r.score}/10</span>
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* Fallback raw answers */}
        {!isEvaluating && !evaluation && !evalError && answers.length > 0 && (
          <div className="bg-slate-900 border border-white/[0.07] rounded-2xl p-6 mb-6 fade-in">
            <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-4">Your answers</p>
            {questions.map((q, i) => (
              <div key={i} className="mb-4 pb-4 border-b border-white/[0.05] last:border-0 last:mb-0 last:pb-0">
                <p className="text-slate-400 text-xs mb-1">Q{i + 1}: {q}</p>
                <p className="text-slate-200 text-sm">{answers[i] || "(no answer given)"}</p>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 fade-in">
          <button
            onClick={() => navigate("/ai-interview")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm hover:bg-indigo-500 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            New interview
          </button>
          <button
            onClick={() =>
              navigate("/ai-interview/session", { state: { role, difficulty, questionCount: questions.length } })
            }
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/[0.1] text-slate-300 text-sm hover:bg-slate-800 transition-colors"
          >
            Retry same role
          </button>
        </div>

      </div>
    </div>
  );
};

export default InterviewResult;