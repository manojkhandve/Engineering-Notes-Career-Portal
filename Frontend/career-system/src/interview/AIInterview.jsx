import React from "react";
import { Routes, Route } from "react-router-dom";
import InterviewSetup from "./InterviewSetup";
import InterviewSession from "./InterviewSession";
import InterviewResult from "./InterviewResult";

const AIInterview = () => {
  return (
    <Routes>
      <Route path="/" element={<InterviewSetup />} />
      <Route path="/session" element={<InterviewSession />} />
      <Route path="/result" element={<InterviewResult />} />
    </Routes>
  );
};

export default AIInterview;
