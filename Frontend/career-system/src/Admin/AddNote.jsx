import React, { useEffect, useState } from "react";

// ─── SUB FORMS ───────────────────────────────────────────────────────────────

const AddCourse = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) return setMessage({ type: "error", text: "Course name is required." });
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("http://localhost:8180/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (res.ok) { setMessage({ type: "success", text: "Course added!" }); setName(""); }
      else setMessage({ type: "error", text: "Failed. Try again." });
    } catch { setMessage({ type: "error", text: "Server error." }); }
    finally { setLoading(false); }
  };

  return (
    <FormWrapper title="Add Course">
      <Field label="Course Name *" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. B.Tech, Diploma" />
      <SubmitBtn onClick={handleSubmit} loading={loading} disabled={!name.trim()} />
      <Msg message={message} />
    </FormWrapper>
  );
};

const AddBranch = () => {
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8180/api/courses")
      .then(r => r.json()).then(d => setCourses(Array.isArray(d) ? d : [])).catch(console.error);
  }, []);

  const handleSubmit = async () => {
    if (!courseId || !name.trim()) return setMessage({ type: "error", text: "All fields required." });
    setLoading(true); setMessage(null);
    try {
      console.log("Sending:", { name, course: { id: Number(courseId) } });
      const res = await fetch("http://localhost:8180/api/branches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, course: { id: Number(courseId) } }),
      });
      if (res.ok) { setMessage({ type: "success", text: "Branch added!" }); setName(""); setCourseId(""); }
      else setMessage({ type: "error", text: "Failed. Try again." });
    } catch { setMessage({ type: "error", text: "Server error." }); }
    finally { setLoading(false); }
  };

  return (
    <FormWrapper title="Add Branch">
      <Select label="Course *" value={courseId} onChange={e => setCourseId(e.target.value)}
        options={courses} placeholder="Select Course" labelField="name" />
      <Field label="Branch Name *" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Computer, Civil" />
      <SubmitBtn onClick={handleSubmit} loading={loading} disabled={!courseId || !name.trim()} />
      <Msg message={message} />
    </FormWrapper>
  );
};

const AddYear = () => {
  const [yearName, setYearName] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!yearName.trim()) return setMessage({ type: "error", text: "Year name is required." });
    setLoading(true); setMessage(null);
    try {
      const res = await fetch("http://localhost:8180/api/years", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ yearName }),
      });
      if (res.ok) { setMessage({ type: "success", text: "Year added!" }); setYearName(""); }
      else setMessage({ type: "error", text: "Failed. Try again." });
    } catch { setMessage({ type: "error", text: "Server error." }); }
    finally { setLoading(false); }
  };

  return (
    <FormWrapper title="Add Year">
      <Field label="Year Name *" value={yearName} onChange={e => setYearName(e.target.value)} placeholder="e.g. First Year, Second Year" />
      <SubmitBtn onClick={handleSubmit} loading={loading} disabled={!yearName.trim()} />
      <Msg message={message} />
    </FormWrapper>
  );
};

const AddSubject = () => {
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [years, setYears] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [branchId, setBranchId] = useState("");
  const [yearId, setYearId] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8180/api/courses").then(r => r.json()).then(d => setCourses(Array.isArray(d) ? d : [])).catch(console.error);
    fetch("http://localhost:8180/api/years").then(r => r.json()).then(d => setYears(Array.isArray(d) ? d : [])).catch(console.error);
  }, []);

  useEffect(() => {
    if (courseId) {
      fetch(`http://localhost:8180/api/branches/by-course?courseId=${courseId}`)
        .then(r => r.json()).then(d => setBranches(Array.isArray(d) ? d : [])).catch(console.error);
    } else { setBranches([]); }
    setBranchId(""); setYearId("");
  }, [courseId]);

  const handleSubmit = async () => {
    if (!branchId || !yearId || !name.trim()) return setMessage({ type: "error", text: "All fields required." });
    setLoading(true); setMessage(null);
    try {
      const res = await fetch("http://localhost:8180/api/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, branch: { id: Number(branchId) }, year: { id: Number(yearId) } }),
      });
      if (res.ok) { setMessage({ type: "success", text: "Subject added!" }); setName(""); setBranchId(""); setYearId(""); setCourseId(""); }
      else setMessage({ type: "error", text: "Failed. Try again." });
    } catch { setMessage({ type: "error", text: "Server error." }); }
    finally { setLoading(false); }
  };

  return (
    <FormWrapper title="Add Subject">
      <Select label="Course *" value={courseId} onChange={e => setCourseId(e.target.value)} options={courses} placeholder="Select Course" labelField="name" />
      <Select label="Branch *" value={branchId} onChange={e => setBranchId(e.target.value)} options={branches} placeholder="Select Branch" labelField="name" disabled={!courseId} />
      <Select label="Year *" value={yearId} onChange={e => setYearId(e.target.value)} options={years} placeholder="Select Year" labelField="yearName" disabled={!branchId} />
      <Field label="Subject Name *" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. DBMS, OS, Java" />
      <SubmitBtn onClick={handleSubmit} loading={loading} disabled={!branchId || !yearId || !name.trim()} />
      <Msg message={message} />
    </FormWrapper>
  );
};

const AddNote = () => {
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [years, setYears] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [branchId, setBranchId] = useState("");
  const [yearId, setYearId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [courseName, setCourseName] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // File fields now hold real File objects (from <input type="file">),
  // matching the @RequestParam MultipartFile names in NoteController exactly:
  // fileData, dkNotesUrl, insemUrl, endsemUrl, modelAnswerUrl, microprojectUrl
  const [form, setForm] = useState({
    title: "",
    fileData: null,
    dkNotesUrl: null,
    insemUrl: null,
    endsemUrl: null,
    modelAnswerUrl: null,
    microprojectUrl: null,
  });

  const isDiploma = courseName.toLowerCase().includes("diploma");

  useEffect(() => {
    fetch("http://localhost:8180/api/courses").then(r => r.json()).then(d => setCourses(Array.isArray(d) ? d : [])).catch(console.error);
    fetch("http://localhost:8180/api/years").then(r => r.json()).then(d => setYears(Array.isArray(d) ? d : [])).catch(console.error);
  }, []);

  useEffect(() => {
    if (courseId) {
      fetch(`http://localhost:8180/api/branches/by-course?courseId=${courseId}`)
        .then(r => r.json()).then(d => setBranches(Array.isArray(d) ? d : [])).catch(console.error);
    } else { setBranches([]); }
    setBranchId(""); setYearId(""); setSubjectId(""); setSubjects([]);
  }, [courseId]);

  useEffect(() => {
    if (branchId && yearId) {
      fetch(`http://localhost:8180/api/subjects?branchId=${branchId}&yearId=${yearId}`)
        .then(r => r.json()).then(d => setSubjects(Array.isArray(d) ? d : [])).catch(console.error);
    } else { setSubjects([]); }
    setSubjectId("");
  }, [branchId, yearId]);

  const resetForm = () => setForm({
    title: "",
    fileData: null,
    dkNotesUrl: null,
    insemUrl: null,
    endsemUrl: null,
    modelAnswerUrl: null,
    microprojectUrl: null,
  });

  const handleSubmit = async () => {
    if (!subjectId || !form.title.trim()) return setMessage({ type: "error", text: "Subject and Title are required." });
    setLoading(true); setMessage(null);

    // Backend takes multipart/form-data, not JSON — build a FormData payload
    // whose keys match NoteController's @RequestParam names exactly.
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("subjectId", subjectId);
    if (form.fileData) fd.append("fileData", form.fileData);

    if (isDiploma) {
      if (form.modelAnswerUrl) fd.append("modelAnswerUrl", form.modelAnswerUrl);
      if (form.microprojectUrl) fd.append("microprojectUrl", form.microprojectUrl);
    } else {
      if (form.dkNotesUrl) fd.append("dkNotesUrl", form.dkNotesUrl);
      if (form.insemUrl) fd.append("insemUrl", form.insemUrl);
      if (form.endsemUrl) fd.append("endsemUrl", form.endsemUrl);
    }

    try {
      const res = await fetch("http://localhost:8180/api/notes", {
        method: "POST",
        // No Content-Type header — the browser sets the multipart boundary itself.
        body: fd,
      });
      if (res.ok) {
        setMessage({ type: "success", text: "Note added!" });
        resetForm();
        setSubjectId("");
      } else setMessage({ type: "error", text: "Failed. Try again." });
    } catch { setMessage({ type: "error", text: "Server error." }); }
    finally { setLoading(false); }
  };

  return (
    <FormWrapper title="Add Note">
      <Select label="Course *" value={courseId} onChange={e => { const s = courses.find(c => String(c.id) === e.target.value); setCourseId(e.target.value); setCourseName(s ? s.name : ""); }} options={courses} placeholder="Select Course" labelField="name" />
      <Select label="Branch *" value={branchId} onChange={e => setBranchId(e.target.value)} options={branches} placeholder="Select Branch" labelField="name" disabled={!courseId} />
      <Select label="Year *" value={yearId} onChange={e => setYearId(e.target.value)} options={years} placeholder="Select Year" labelField="yearName" disabled={!branchId} />
      <Select label="Subject *" value={subjectId} onChange={e => setSubjectId(e.target.value)} options={subjects} placeholder="Select Subject" labelField="name" disabled={!yearId} />
      {subjectId && (
        <>
          <hr className="border-gray-100" />
          <p className="text-xs text-gray-400 uppercase tracking-wide">{isDiploma ? "Diploma Fields" : "Degree Fields"}</p>
          <Field label="Title *" name="title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Unit 1 Notes" />
          <FileField label="Notes File" file={form.fileData} onChange={e => setForm(p => ({ ...p, fileData: e.target.files[0] || null }))} />
          {isDiploma ? (
            <>
              <FileField label="Model Answer File" file={form.modelAnswerUrl} onChange={e => setForm(p => ({ ...p, modelAnswerUrl: e.target.files[0] || null }))} />
              <FileField label="Microproject File" file={form.microprojectUrl} onChange={e => setForm(p => ({ ...p, microprojectUrl: e.target.files[0] || null }))} />
            </>
          ) : (
            <>
              <FileField label="DK Notes File" file={form.dkNotesUrl} onChange={e => setForm(p => ({ ...p, dkNotesUrl: e.target.files[0] || null }))} />
              <FileField label="InSem Papers File" file={form.insemUrl} onChange={e => setForm(p => ({ ...p, insemUrl: e.target.files[0] || null }))} />
              <FileField label="EndSem Papers File" file={form.endsemUrl} onChange={e => setForm(p => ({ ...p, endsemUrl: e.target.files[0] || null }))} />
            </>
          )}
        </>
      )}
      <SubmitBtn onClick={handleSubmit} loading={loading} disabled={!subjectId || !form.title.trim()} />
      <Msg message={message} />
    </FormWrapper>
  );
};

// ─── SHARED UI ────────────────────────────────────────────────────────────────

const FormWrapper = ({ title, children }) => (
  <div className="bg-white rounded-2xl shadow border p-5 sm:p-6 max-w-2xl space-y-4">
    <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
    {children}
  </div>
);

const Field = ({ label, value, onChange, placeholder }) => (
  <div>
    <label className="text-xs text-gray-400 mb-1 block">{label}</label>
    <input type="text" value={value} onChange={onChange} placeholder={placeholder}
      className="w-full p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
  </div>
);

const FileField = ({ label, file, onChange, accept }) => (
  <div>
    <label className="text-xs text-gray-400 mb-1 block">{label}</label>
    <div className="flex items-center gap-2">
      <label className="cursor-pointer px-3 py-2 text-xs font-semibold bg-gray-100 hover:bg-gray-200 border rounded-lg text-gray-600 transition shrink-0">
        Choose File
        <input type="file" accept={accept} onChange={onChange} className="hidden" />
      </label>
      <span className="text-xs text-gray-500 truncate">
        {file ? file.name : "No file selected"}
      </span>
    </div>
  </div>
);

const Select = ({ label, value, onChange, options, placeholder, labelField, disabled }) => (
  <div className={disabled ? "opacity-40 pointer-events-none" : ""}>
    <label className="text-xs text-gray-400 mb-1 block">{label}</label>
    <select value={value} onChange={onChange}
      className="w-full p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
      <option value="">{placeholder}</option>
      {options.map(o => <option key={o.id} value={o.id}>{o[labelField]}</option>)}
    </select>
  </div>
);

const SubmitBtn = ({ onClick, loading, disabled }) => (
  <button onClick={onClick} disabled={loading || disabled}
    className={`w-full py-2.5 rounded-lg text-sm font-semibold transition ${!loading && !disabled ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
    {loading ? "Saving..." : "Submit"}
  </button>
);

const Msg = ({ message }) => message ? (
  <div className={`text-sm px-4 py-2 rounded-lg ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
    {message.type === "success" ? "✅ " : "❌ "}{message.text}
  </div>
) : null;

// ─── OPTION CARDS ─────────────────────────────────────────────────────────────

const options = [
  { key: "course",   label: "Course",   icon: "🎓", desc: "Add a new course" },
  { key: "branch",   label: "Branch",   icon: "🌿", desc: "Add branch under a course" },
  { key: "year",     label: "Year",     icon: "📅", desc: "Add academic year" },
  { key: "subject",  label: "Subject",  icon: "📖", desc: "Add subject to branch & year" },
  { key: "note",     label: "Note",     icon: "📝", desc: "Add notes / papers" },
];

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

const AdminAdd = () => {
  const [selected, setSelected] = useState(null);

  const renderForm = () => {
    switch (selected) {
      case "course":  return <AddCourse />;
      case "branch":  return <AddBranch />;
      case "year":    return <AddYear />;
      case "subject": return <AddSubject />;
      case "note":    return <AddNote />;
      default:        return null;
    }
  };

  return (
    <div className="ml-0 md:ml-64 p-4 sm:p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
          ➕ Admin Panel
        </h1>
        <p className="text-gray-500 text-sm">What do you want to add?</p>
      </div>

      {/* OPTION CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-8 max-w-2xl">
        {options.map(opt => (
          <button
            key={opt.key}
            onClick={() => setSelected(opt.key)}
            className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition
              ${selected === opt.key
                ? "bg-blue-600 text-white border-blue-600 shadow-lg"
                : "bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:shadow"}`}
          >
            <span className="text-2xl mb-1">{opt.icon}</span>
            <span className="text-xs font-semibold">{opt.label}</span>
            <span className={`text-xs mt-0.5 ${selected === opt.key ? "text-blue-100" : "text-gray-400"}`}>
              {opt.desc}
            </span>
          </button>
        ))}
      </div>

      {/* FORM */}
      {renderForm()}

    </div>
  );
};

export default AdminAdd;