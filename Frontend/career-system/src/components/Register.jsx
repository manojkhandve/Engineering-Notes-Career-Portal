import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";

const API_BASE_URL = "http://localhost:8080/api/auth";

function Field({ icon: Icon, label, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {label}
      </label>

      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
          <Icon size={16} />
        </span>

        {children}
      </div>

      {error && (
        <p className="text-xs text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}

const inputCls = (error) =>
  `w-full pl-11 pr-4 py-3 rounded-xl border bg-white text-sm outline-none transition-all
   focus:ring-4 focus:ring-blue-100 focus:border-blue-500
   ${
     error
       ? "border-red-300 bg-red-50"
       : "border-gray-200 hover:border-gray-300"
   }`;

function OtpInput({ value, onChange, error }) {

  const refs = Array.from({ length: 6 }, () => useRef(null));

  const handleChange = (i, e) => {

    const val = e.target.value.replace(/\D/g, "").slice(-1);

    const arr = value.split("");

    arr[i] = val;

    onChange(arr.join(""));

    if (val && i < 5) {
      refs[i + 1].current.focus();
    }
  };

  const handleKeyDown = (i, e) => {

    if (e.key === "Backspace" && !value[i] && i > 0) {
      refs[i - 1].current.focus();
    }
  };

  return (
    <div>

      <div className="flex justify-center gap-2">

        {Array.from({ length: 6 }).map((_, i) => (

          <input
            key={i}
            ref={refs[i]}
            type="text"
            maxLength={1}
            inputMode="numeric"
            value={value[i] || ""}
            onChange={(e) => handleChange(i, e)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className={`w-12 h-12 rounded-xl border text-center text-lg font-bold outline-none
              focus:ring-4 focus:ring-blue-100 focus:border-blue-500
              ${
                error
                  ? "border-red-300 bg-red-50"
                  : "border-gray-200"
              }`}
          />

        ))}

      </div>

      {error && (
        <p className="text-xs text-red-500 text-center mt-2">
          {error}
        </p>
      )}

    </div>
  );
}

const Register = () => {

  const navigate = useNavigate();

  const [step, setStep] = useState("email");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const [otp, setOtp] = useState("");

  const [otpError, setOtpError] = useState("");

  const [showPass, setShowPass] = useState(false);

  const [loading, setLoading] = useState(false);

  const [otpLoading, setOtpLoading] = useState(false);

  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {

    if (cooldown <= 0) return;

    const timer = setTimeout(() => {
      setCooldown((p) => p - 1);
    }, 1000);

    return () => clearTimeout(timer);

  }, [cooldown]);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (errors[e.target.name]) {

      setErrors({
        ...errors,
        [e.target.name]: "",
      });
    }
  };

  // SEND OTP
  const handleSendOtp = async (e) => {

    e.preventDefault();

    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter valid email";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Minimum 6 characters";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {

      setLoading(true);

      await axios.post(
        `${API_BASE_URL}/send-otp?email=${formData.email}`
      );

      setStep("otp");

      setCooldown(30);

      alert("OTP sent successfully");

    } catch (error) {

      console.log(error);

      if (error.response?.data) {
        alert(error.response.data);
      } else {
        alert("Failed to send OTP");
      }

    } finally {
      setLoading(false);
    }
  };

  // VERIFY OTP + REGISTER
  const handleVerifyOtp = async (e) => {

    e.preventDefault();

    if (otp.length < 6) {
      setOtpError("Enter complete OTP");
      return;
    }

    try {

      setOtpLoading(true);

      await axios.post(
        `${API_BASE_URL}/verify-register?name=${formData.name}&password=${formData.password}`,
        {
          email: formData.email,
          otp: otp,
        }
      );

      setStep("success");

    } catch (error) {

      console.log(error);

      setOtpError(
        error.response?.data || "Invalid OTP"
      );

    } finally {
      setOtpLoading(false);
    }
  };

  // RESEND OTP
  const resendOtp = async () => {

    if (cooldown > 0) return;

    try {

      await axios.post(
        `${API_BASE_URL}/send-otp?email=${formData.email}`
      );

      setCooldown(30);

      setOtp("");

      alert("OTP resent successfully");

    } catch (error) {

      console.log(error);

      alert("Failed to resend OTP");
    }
  };

  // SUCCESS SCREEN
  if (step === "success") {

    return (

      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-5">

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10 w-full max-w-md text-center">

          <div className="w-20 h-20 rounded-3xl bg-green-100 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="text-green-600" size={38} />
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            Registration Successful
          </h1>

          <p className="text-sm text-gray-500 mt-3">
            Your account has been created successfully.
          </p>

          <button
            onClick={() => navigate("/login")}
            className="inline-flex items-center gap-2 mt-7 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
          >

            Go to Login

            <ArrowRight size={16} />

          </button>

        </div>

      </div>
    );
  }

  return (

    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center p-5">

      <div className="w-full max-w-md bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-hidden">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-8 text-white">

          <h1 className="text-3xl font-bold">
            Create Account
          </h1>

          <p className="text-blue-100 mt-2 text-sm">
            Verify your email and start exploring jobs
          </p>

        </div>

        {/* EMAIL STEP */}
        {step === "email" && (

          <form
            onSubmit={handleSendOtp}
            className="p-8 space-y-5"
          >

            <Field
              icon={User}
              label="Full Name"
              error={errors.name}
            >

              <input
                type="text"
                name="name"
                placeholder="Rahul Sharma"
                value={formData.name}
                onChange={handleChange}
                className={inputCls(errors.name)}
              />

            </Field>

            <Field
              icon={Mail}
              label="Email Address"
              error={errors.email}
            >

              <input
                type="email"
                name="email"
                placeholder="rahul@gmail.com"
                value={formData.email}
                onChange={handleChange}
                className={inputCls(errors.email)}
              />

            </Field>

            <Field
              icon={Lock}
              label="Password"
              error={errors.password}
            >

              <div className="relative">

                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  className={inputCls(errors.password) + " pr-10"}
                />

                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >

                  {showPass ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}

                </button>

              </div>

            </Field>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
            >

              {loading ? "Sending OTP..." : "Send Verification Code"}

            </button>

          </form>
        )}

        {/* OTP STEP */}
        {step === "otp" && (

          <form
            onSubmit={handleVerifyOtp}
            className="p-8"
          >

            <div className="text-center mb-6">

              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="text-blue-600" size={30} />
              </div>

              <h2 className="text-2xl font-bold text-gray-900">
                Verify Email
              </h2>

              <p className="text-sm text-gray-500 mt-2">
                Enter the 6-digit OTP sent to
              </p>

              <p className="font-semibold text-gray-800 mt-1">
                {formData.email}
              </p>

            </div>

            <OtpInput
              value={otp}
              onChange={setOtp}
              error={otpError}
            />

            <button
              type="submit"
              disabled={otpLoading}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
            >

              {otpLoading ? "Verifying..." : "Verify OTP"}

            </button>

            <div className="flex justify-between items-center mt-5 text-sm">

              <button
                type="button"
                onClick={() => setStep("email")}
                className="text-gray-500 hover:text-gray-700"
              >
                Change Email
              </button>

              <button
                type="button"
                disabled={cooldown > 0}
                onClick={resendOtp}
                className={`flex items-center gap-1
                  ${
                    cooldown > 0
                      ? "text-gray-400"
                      : "text-blue-600"
                  }`}
              >

                <RefreshCw size={13} />

                {cooldown > 0
                  ? `Resend in ${cooldown}s`
                  : "Resend OTP"}

              </button>

            </div>

          </form>
        )}

        {/* FOOTER */}
        <div className="px-8 pb-8 text-center">

          <p className="text-sm text-gray-500">

            Already have an account?{" "}

            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Login
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
};

export default Register;