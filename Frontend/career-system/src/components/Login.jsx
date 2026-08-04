import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, Rocket,
  BookOpen, Briefcase, Code2,
} from "lucide-react";

const features = [
  { icon: BookOpen,  label: "10,000+ Study Notes",   count: "10k+" },
  { icon: Briefcase, label: "850+ Job Listings",      count: "850+" },
  { icon: Code2,     label: "DSA Sheet & Mock Tests", count: "Free" },
];

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [focused, setFocused]   = useState("");
  const [error, setError]       = useState("");

  const handleChange = (e) => {
    setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 1400)); // replace with real auth
    setLoading(false);
    alert("Login Successful!");
  };

  const inputBase =
    "w-full bg-gray-50 border rounded-xl px-4 py-2.5 pl-10 text-sm text-gray-800 placeholder-gray-400 outline-none transition-all duration-200";
  const inputFocusCls = (name) =>
    focused === name
      ? "border-blue-500 ring-2 ring-blue-100 bg-white"
      : "border-gray-200 hover:border-gray-300";

  return (
    <div className="ml-0 md:ml-64 min-h-screen bg-gray-50 p-4 md:p-8 flex items-start justify-center">
      <div className="w-full max-w-4xl">

        {/* Page header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
            <Rocket size={17} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Welcome back 👋</h1>
            <p className="text-sm text-gray-500 mt-0.5">Sign in to continue to your dashboard</p>
          </div>
        </div>

        {/* Card: two columns */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row">

          {/* ── LEFT: brand / stats panel ── */}
          <div className="md:w-72 bg-blue-600 p-7 flex flex-col justify-between flex-shrink-0">
            <div className="space-y-6">

              {/* Brand */}
              <div>
                <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-1">Platform</p>
                <h2 className="text-white text-xl font-bold">
                  Edu<span className="text-blue-200">Launch</span>
                </h2>
                <p className="text-blue-200 text-sm mt-2 leading-relaxed">
                  Everything a student needs to land their first job.
                </p>
              </div>

              {/* Feature rows */}
              <div className="space-y-2.5">
                {features.map(({ icon: Icon, label, count }) => (
                  <div key={label} className="flex items-center gap-3 bg-white/10 rounded-xl px-3 py-2.5">
                    <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                      <Icon size={13} className="text-white" />
                    </div>
                    <span className="text-white text-sm flex-1 leading-tight">{label}</span>
                    <span className="text-blue-200 text-xs font-semibold">{count}</span>
                  </div>
                ))}
              </div>

              {/* Social proof */}
              <div className="bg-white/10 rounded-xl p-4">
                <div className="flex -space-x-2 mb-2.5">
                  {["A","B","C","D"].map((l, i) => (
                    <div
                      key={i}
                      className="w-7 h-7 rounded-full border-2 border-blue-600 flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: ["#3b82f6","#8b5cf6","#10b981","#f59e0b"][i] }}
                    >
                      {l}
                    </div>
                  ))}
                </div>
                <p className="text-white text-sm font-semibold">12,400+ students</p>
                <p className="text-blue-200 text-xs mt-0.5">already onboard and growing</p>
              </div>
            </div>

            {/* Testimonial */}
            <div className="border-t border-white/20 pt-5 mt-6">
              <p className="text-blue-100 text-xs italic leading-relaxed">
                "EduLaunch helped me crack my first internship in 3 months."
              </p>
              <p className="text-blue-300 text-xs mt-1.5">— Priya S., SDE Intern @ Amazon</p>
            </div>
          </div>

          {/* ── RIGHT: form ── */}
          <div className="flex-1 p-7 md:p-10 flex flex-col justify-center">

            {/* Error banner */}
            {error && (
              <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 max-w-sm w-full mx-auto">

              {/* Email */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                  Email address
                </label>
                <div className="relative">
                  <Mail
                    size={15}
                    className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${focused === "email" ? "text-blue-500" : "text-gray-400"}`}
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="rahul@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused("")}
                    required
                    className={`${inputBase} ${inputFocusCls("email")}`}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-xs text-blue-600 hover:underline font-medium">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock
                    size={15}
                    className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${focused === "password" ? "text-blue-500" : "text-gray-400"}`}
                  />
                  <input
                    type={showPass ? "text" : "password"}
                    name="password"
                    placeholder="Your password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused("")}
                    required
                    className={`${inputBase} ${inputFocusCls("password")} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700
                  disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold
                  py-2.5 rounded-xl transition-all text-sm shadow-sm mt-1"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                    Signing in…
                  </>
                ) : (
                  <>Sign In <ArrowRight size={15} /></>
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-gray-400">or</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              {/* Google */}
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2.5 border border-gray-200
                  hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-medium
                  py-2.5 rounded-xl transition-all text-sm"
              >
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>

            </form>

            {/* Footer */}
            <div className="max-w-sm w-full mx-auto mt-6 text-center space-y-2">
              <p className="text-sm text-gray-500">
                Don't have an account?{" "}
                <Link to="/register" className="text-blue-600 font-semibold hover:underline">
                  Create one free
                </Link>
              </p>
              <p className="text-xs text-gray-400">
                By signing in, you agree to our{" "}
                <span className="underline cursor-pointer hover:text-gray-600">Terms</span>{" "}&{" "}
                <span className="underline cursor-pointer hover:text-gray-600">Privacy Policy</span>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;