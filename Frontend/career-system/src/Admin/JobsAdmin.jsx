import React, { useEffect, useState } from "react";

const JobsAdmin = () => {

  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("jobs")) || [];
    setJobs(data);
  }, []);

  const deleteJob = (id) => {

    const updated = jobs.filter((j) => j.id !== id);

    setJobs(updated);
    localStorage.setItem("jobs", JSON.stringify(updated));
  };

  return (

    <div className="ml-0 md:ml-64 p-6 bg-gray-50 min-h-screen">

      <h1 className="text-2xl font-bold mb-6">
        Jobs Management
      </h1>

      <div className="grid md:grid-cols-2 gap-6">

        {jobs.map((job) => (
          <div key={job.id} className="bg-white p-6 rounded-xl shadow">

            <h2 className="text-xl font-bold">
              {job.title}
            </h2>

            <p className="text-gray-500">
              {job.company}
            </p>

            <div className="mt-4 flex gap-4">

              <button className="text-blue-600">
                Edit
              </button>

              <button
                onClick={() => deleteJob(job.id)}
                className="text-red-600"
              >
                Delete
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
};

export default JobsAdmin;