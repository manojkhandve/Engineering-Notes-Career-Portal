import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const OPENROUTER_BASE = "https://openrouter.ai/api/v1/chat/completions";
const MODELS = ["gryphe/mythomax-l2-13b", "nousresearch/nous-capybara-7b"];

const InterviewSession = () => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    role = "Software Engineer",
    difficulty = "intermediate",
    questionCount = 5,
  } = location.state || {};

  const [questions, setQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [tabWarnings, setTabWarnings] = useState(0);
  const [cameraError, setCameraError] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // ── 1. Generate questions via OpenRouter ─────────────────────────────────
  useEffect(() => {
    const generate = async () => {
      setIsLoading(true);
      setLoadError("");

      const prompt = `You are a professional interviewer. Generate exactly ${questionCount} interview questions for a ${difficulty}-level ${role} position.

Return ONLY a raw JSON array of ${questionCount} strings. No markdown, no explanation, no numbering.
Example: ["Question one?","Question two?"]

Make questions specific to the role and appropriate for ${difficulty} difficulty.`;

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
              temperature: 0.7,
              max_tokens: 800,
            }),
          });

          if (!res.ok) {
            const errText = await res.text();
            errors.push(`Model ${model} — HTTP ${res.status}: ${errText.slice(0, 100)}`);
            continue;
          }

          const data = await res.json();
          const raw = data.choices?.[0]?.message?.content || "";

          if (!raw) {
            errors.push(`Model ${model} returned empty content.`);
            continue;
          }

          const match = raw.match(/\[[\s\S]*?\]/);
          if (!match) {
            errors.push(`Model ${model} — could not parse JSON array.`);
            continue;
          }

          const parsed = JSON.parse(match[0]);
          if (!Array.isArray(parsed) || parsed.length === 0) {
            errors.push(`Model ${model} — empty questions array.`);
            continue;
          }

          setQuestions(parsed);
          setIsLoading(false);
          return; // ✅ success — stop trying further models
        } catch (err) {
          errors.push(`Model ${model} — ${err.message}`);
        }
      }

      // All models failed
      setLoadError(`All models failed:\n${errors.join("\n")}`);
      setIsLoading(false);
    };

    generate();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── 2. Camera ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch {
        setCameraError(true);
      }
    };
    startCamera();
    return () => streamRef.current?.getTracks().forEach((t) => t.stop());
  }, []);

  // ── 3. Tab-switch detection ───────────────────────────────────────────────
  useEffect(() => {
    const handle = () => {
      if (document.hidden) setTabWarnings((p) => p + 1);
    };
    document.addEventListener("visibilitychange", handle);
    return () => document.removeEventListener("visibilitychange", handle);
  }, []);

  // ── 4. Speak current question ─────────────────────────────────────────────
  useEffect(() => {
    if (!isLoading && questions.length > 0) {
      speakText(questions[questionIndex]);
    }
  }, [questionIndex, isLoading, questions]); // eslint-disable-line react-hooks/exhaustive-deps

  const speakText = (text) => {
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 0.95;
    utt.onstart = () => setIsSpeaking(true);
    utt.onend = () => setIsSpeaking(false);
    utt.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utt);
  };

  // ── 5. Speech recognition ─────────────────────────────────────────────────
  const startListening = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert("Speech recognition is not supported in this browser. Please use Chrome.");
      return;
    }
    window.speechSynthesis.cancel();
    setCurrentTranscript("");

    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";
    recognitionRef.current = rec;

    let finalAccumulated = "";

    rec.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          finalAccumulated += e.results[i][0].transcript + " ";
        } else {
          interim += e.results[i][0].transcript;
        }
      }
      setCurrentTranscript(finalAccumulated + interim);
    };

    rec.onerror = () => setIsListening(false);
    rec.onend = () => setIsListening(false);

    rec.start();
    setIsListening(true);
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  // ── 6. Next / Finish ──────────────────────────────────────────────────────
  const handleNext = () => {
    stopListening();
    window.speechSynthesis.cancel();
    const answer = currentTranscript.trim() || "(no answer given)";
    const updatedAnswers = [...answers, answer];
    setAnswers(updatedAnswers);
    setCurrentTranscript("");

    if (questionIndex < questions.length - 1) {
      setQuestionIndex((i) => i + 1);
    } else {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      navigate("/ai-interview/result", {
        state: { role, difficulty, questions, answers: updatedAnswers, tabWarnings },
      });
    }
  };

  const progress =
    questions.length > 0 ? Math.round((questionIndex / questions.length) * 100) : 0;

  // ─── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="ml-0 md:ml-64 min-h-screen bg-slate-950 flex items-center justify-center">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Mulish:wght@400;500&display=swap');
          .font-body{font-family:'Mulish',sans-serif}
          @keyframes spin{to{transform:rotate(360deg)}}
          .spin{animation:spin 0.8s linear infinite}
        `}</style>
        <div className="font-body text-center">
          <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full spin mx-auto mb-4" />
          <p className="text-slate-300 text-sm">Generating your <span className="text-indigo-400">{role}</span> interview…</p>
          <p className="text-slate-500 text-xs mt-1">{questionCount} {difficulty} questions via AI</p>
        </div>
      </div>
    );
  }

  // ─── Error ─────────────────────────────────────────────────────────────────
  if (loadError) {
    return (
      <div className="ml-0 md:ml-64 min-h-screen bg-slate-950 flex items-center justify-center px-6">
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Mulish:wght@400;500&display=swap');.font-body{font-family:'Mulish',sans-serif}`}</style>
        <div className="font-body text-center max-w-sm">
          <p className="text-rose-400 text-3xl mb-3">⚠</p>
          <p className="text-slate-200 font-semibold mb-2">Could not generate questions</p>
          <p className="text-slate-500 text-sm mb-5 whitespace-pre-line">{loadError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-500"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // ─── Session ───────────────────────────────────────────────────────────────
  return (
    <div className="ml-0 md:ml-64 min-h-screen bg-slate-950 p-6">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;700&family=Mulish:wght@400;500;600&display=swap');
        .font-display{font-family:'Bricolage Grotesque',sans-serif}
        .font-body{font-family:'Mulish',sans-serif}
        @keyframes pulseD{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(1.4)}}
        .pulse-dot{animation:pulseD 1.2s ease-in-out infinite}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .fade-in{animation:fadeIn 0.35s ease both}
      `}</style>

      <div className="font-body max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-white text-xl leading-tight">{role} Interview</h1>
            <p className="text-slate-500 text-xs mt-0.5 capitalize">{difficulty} level</p>
          </div>
          <div className="flex items-center gap-3">
            {tabWarnings > 0 && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/20">
                ⚠ {tabWarnings} tab switch{tabWarnings > 1 ? "es" : ""}
              </span>
            )}
            <span className="text-xs text-slate-400">
              {questionIndex + 1} / {questions.length}
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="h-1 bg-slate-800 rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {/* Camera */}
          <div className="relative bg-slate-900 border border-white/[0.07] rounded-2xl overflow-hidden aspect-video flex items-center justify-center">
            {cameraError ? (
              <div className="text-center p-6">
                <p className="text-slate-600 text-4xl mb-2">📷</p>
                <p className="text-slate-500 text-sm">Camera unavailable</p>
              </div>
            ) : (
              <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
            )}
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 pulse-dot" />
              <span className="text-white text-xs">Live</span>
            </div>
          </div>

          {/* Question + Answer */}
          <div className="bg-slate-900 border border-white/[0.07] rounded-2xl p-6 flex flex-col gap-5">

            {/* Question */}
            <div className="fade-in" key={questionIndex}>
              <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-2">
                Question {questionIndex + 1}
              </p>
              <p className="text-slate-100 text-base leading-relaxed font-semibold">
                {questions[questionIndex]}
              </p>
              <button
                onClick={() => speakText(questions[questionIndex])}
                disabled={isSpeaking}
                className="mt-2 flex items-center gap-1.5 text-indigo-400 text-xs hover:text-indigo-300 transition-colors disabled:opacity-40"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M12 6v12m-3.536-9.536a5 5 0 000 7.072" />
                </svg>
                {isSpeaking ? "Speaking…" : "Repeat question"}
              </button>
            </div>

            <div className="border-t border-white/[0.06]" />

            {/* Transcript */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Your answer</p>
                {isListening && (
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500 pulse-dot" />
                    <span className="text-xs text-rose-400">Listening…</span>
                  </div>
                )}
              </div>
              <div className="min-h-[80px] bg-slate-800/60 rounded-xl p-3 text-sm text-slate-300 leading-relaxed">
                {currentTranscript || (
                  <span className="text-slate-600">Press "Start answer" and speak…</span>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-2 flex-wrap mt-auto">
              {!isListening ? (
                <button
                  onClick={startListening}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm hover:bg-emerald-500/20 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 016 0v6a3 3 0 01-3 3z" />
                  </svg>
                  Start answer
                </button>
              ) : (
                <button
                  onClick={stopListening}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm hover:bg-rose-500/20 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <rect x="6" y="6" width="12" height="12" rx="1" />
                  </svg>
                  Stop
                </button>
              )}

              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm hover:bg-indigo-500 transition-colors ml-auto"
              >
                {questionIndex < questions.length - 1 ? "Next question" : "Finish interview"}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSession;