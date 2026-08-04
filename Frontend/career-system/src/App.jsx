import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import Jobs from "./components/Jobs";
import ATSChecker from "./components/ATSChecker";
import AppliedJobs from "./components/AppliedJobs";
import NotesSelector from "./components/NotesSelector";
import YearNotes from "./components/YearNotes";   // ⭐ ADD THIS
import Footer from "./components/Footer";
import Register from "./components/Register";
import Login from "./components/Login";
import Testimonials from "./components/Testimonials";
import Aptitude from "./components/Aptitude";
import Profile from "./components/Profile";
import JobDetails from "./components/JobDetails";
import Quantitative from "./aptittude/Quantitative";
import DSASheet from "./DSA/DSASheet";
import AIInterview from "./interview/AIInterview";
import AdminDashboard from "./Admin/AdminDashboard";
import QuantAI from "./aptittude/QuantAi";
import JobsTable from "./Admin/JobsTable";
import NotesViewer from "./components/NotesViewer";
import AddNote from "./Admin/AddNote";
import AdminAdd from "./Admin/AdminAdd";
import AddJob from "./Admin/AddJob";
function App() {

  const [open, setOpen] = useState(false);

  return (
    <BrowserRouter>

      {/* Sidebar */}
      <Sidebar open={open} setOpen={setOpen} />

      {/* Main Content */}
      <main className="flex-1">

        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/quant-ai" element={<QuantAI/>}/>

          <Route path="/jobs" element={<Jobs />} />
          <Route path="/job/:id" element={<JobDetails />} />
          <Route path="/applied-jobs" element={<AppliedJobs />} />

          {/* Notes */}
          <Route path="/notes" element={<NotesSelector />} />
          <Route path="/notes/:type/:branch/:year" element={<YearNotes />} />
          <Route path="/notes/view" element={<NotesViewer />} />
          <Route path="/addnote" element={<AddNote/>}/>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/quantitative" element={<Quantitative />} />
          <Route path="/ats" element={<ATSChecker />} />
          <Route path="/apti" element={<Aptitude />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dsa" element={<DSASheet />} />
          <Route path="/ai-interview/*" element={<AIInterview />} />

          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="/addjob" element={<AddJob/>}/>
          <Route path="/admin/jobs" element={<JobsTable />} />
          <Route path="/adminnotes" element={<AdminAdd/>}/>

        </Routes>

      </main>

      {/* Footer */}
      <Testimonials />
      <Footer />

    </BrowserRouter>
  );
}

export default App;