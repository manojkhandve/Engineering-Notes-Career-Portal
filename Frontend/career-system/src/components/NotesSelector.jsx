
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const NotesSelector = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [years, setYears] = useState([]);

  const [courseId, setCourseId] = useState("");
  const [branchId, setBranchId] = useState("");
  const [yearId, setYearId] = useState("");

  // Fetch Courses
  useEffect(() => {
    fetch("http://localhost:8180/api/courses")
      .then(res => res.json())
      .then(data => setCourses(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  }, []);

  // Fetch Branches when courseId changes
  useEffect(() => {
    if (courseId) {
      fetch(`http://localhost:8180/api/branches/by-course?courseId=${courseId}`)
        .then(res => res.json())
        .then(data => setBranches(Array.isArray(data) ? data : []))
        .catch(err => console.error(err));
    } else {
      setBranches([]);
    }
  }, [courseId]);

  // Fetch Years
  useEffect(() => {
    fetch("http://localhost:8180/api/years")
      .then(res => res.json())
      .then(data => setYears(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  }, []);

// In NotesSelector — find selected course name
const handleSubmit = () => {
  if (!courseId || !branchId || !yearId) return;
  const selectedCourse = courses.find(c => String(c.id) === String(courseId));
  const courseName = selectedCourse ? selectedCourse.name : "";
  navigate(`/notes/view?branch=${branchId}&year=${yearId}&courseName=${encodeURIComponent(courseName)}`);
};

  return (
    <div className="lg:ml-64 min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-100 px-3 sm:px-4 md:px-6 py-4">
      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            📚 Find Notes
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm">
            Select details quickly
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg border p-4 sm:p-5 space-y-6">

          {/* Course */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">Course</label>
            <select
              className="w-full p-2 border rounded"
              value={courseId}
              onChange={(e) => {
                setCourseId(e.target.value);
                setBranchId("");
              }}
            >
              <option value="">Select Course</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Branch */}
          <div className={`${courseId ? "" : "opacity-40 pointer-events-none"}`}>
            <label className="text-xs text-gray-400 mb-2 block">Branch</label>
            <select
              className="w-full p-2 border rounded"
              value={branchId}
              onChange={(e) => setBranchId(e.target.value)}
            >
              <option value="">Select Branch</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div className={`${branchId ? "" : "opacity-40 pointer-events-none"}`}>
            <label className="text-xs text-gray-400 mb-2 block">Year</label>
            <select
              className="w-full p-2 border rounded"
              value={yearId}
              onChange={(e) => setYearId(e.target.value)}
            >
              <option value="">Select Year</option>
              {years.map((y) => (
                <option key={y.id} value={y.id}>{y.yearName}</option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!courseId || !branchId || !yearId}
            className={`w-full py-2.5 rounded-lg text-sm font-semibold transition ${
              courseId && branchId && yearId
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-400"
            }`}
          >
            View Notes
          </button>

        </div>
      </div>
    </div>
  );
};

export default NotesSelector;