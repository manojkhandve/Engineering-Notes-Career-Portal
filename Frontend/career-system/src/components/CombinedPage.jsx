import React, { useState } from "react";
import { Helmet } from "react-helmet";
import notesData from "../notesData";

const CombinedPage = () => {

  const [branch, setBranch] = useState("");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");

  const branches = Object.keys(notesData);

  const years =
    course === "degree"
      ? ["first-year", "second-year", "third-year", "fourth-year"]
      : ["first-year", "second-year", "third-year"];

  const SelectedComponent =
    branch && course && year
      ? notesData?.[branch]?.[course]?.[year]
      : null;

  return (
    <>
      <Helmet>
        <title>Engineering Notes | Diploma & Degree</title>
        <meta
          name="description"
          content="Select branch, course and year to view engineering notes and model answer papers."
        />
      </Helmet>

      <div className="min-h-screen flex flex-col items-center justify-start pt-16 bg-gray-50">

        <h1 className="text-2xl font-bold mb-6">
          Select Branch, Course & Year
        </h1>

        <div className="flex flex-col gap-4 w-72">

          {/* Branch Dropdown */}
          <select
            className="p-3 border rounded"
            value={branch}
            onChange={(e) => {
              setBranch(e.target.value);
              setCourse("");
              setYear("");
            }}
          >
            <option value="">Select Branch</option>
            {branches.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          {/* Course Dropdown */}
          {branch && (
            <select
              className="p-3 border rounded"
              value={course}
              onChange={(e) => {
                setCourse(e.target.value);
                setYear("");
              }}
            >
              <option value="">Select Course</option>
              <option value="diploma">Diploma</option>
              <option value="degree">Degree</option>
            </select>
          )}

          {/* Year Dropdown */}
          {course && (
            <select
              className="p-3 border rounded"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="">Select Year</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y.replace("-", " ").toUpperCase()}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Render Selected Component */}
        <div className="mt-10 w-full flex justify-center">
          {SelectedComponent ? <SelectedComponent /> : null}
        </div>

      </div>
    </>
  );
};

export default CombinedPage;