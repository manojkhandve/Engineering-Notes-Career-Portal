
// ---------------- NEW PAGE: Computer First Year ----------------

import React from "react";

export const ComputerdFirst = () => {
  const resources = [
    { subject: "Mathematics" },
    { subject: "Programming in C" },
    { subject: "Physics" },
    { subject: "Basic Electronics" },
    { subject: "Engineering Drawing" },
    { subject: "Workshop Practice" },
  ];

  if (resources.length === 0) {
    return (
      <div className="lg:ml-64 p-6 text-center text-gray-500 text-lg">
        No Data Available
      </div>
    );
  }

  return (
    <div className="lg:ml-64 p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
          📘 Computer Engineering - First Year
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Download notes and question papers easily
        </p>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-4 shadow-sm border hover:shadow-lg hover:-translate-y-1 transition"
          >
            <h2 className="text-base font-semibold text-gray-800 mb-3">
              {item.subject}
            </h2>

            <div className="flex gap-2">
              <a
                href="#"
                className="flex-1 text-center text-sm bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Notes
              </a>

              <a
                href="#"
                className="flex-1 text-center text-sm bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
              >
                Papers
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComputerdFirst