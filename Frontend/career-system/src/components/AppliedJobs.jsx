import React, { useEffect, useState } from "react";
import { Briefcase, MapPin, IndianRupee, CalendarCheck } from "lucide-react";

const AppliedJobs = () => {

  const [jobs, setJobs] = useState([]);

  useEffect(() => {

    const storedJobs = JSON.parse(localStorage.getItem("appliedJobs")) || [];
    setJobs(storedJobs);

  }, []);

  return (

    <div className="ml-0 md:ml-64 p-6 md:p-10 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="mb-10">

        <h1 className="text-3xl md:text-4xl font-bold">
          Applied Jobs
        </h1>

        <p className="text-gray-600 mt-2">
          Track all the jobs you have applied for.
        </p>

      </div>

      {/* Empty State */}
      {jobs.length === 0 ? (

        <div className="bg-white p-10 rounded-xl shadow text-center">

          <Briefcase className="mx-auto text-gray-400 mb-4" size={40} />

          <h2 className="text-xl font-semibold">
            No Applications Yet
          </h2>

          <p className="text-gray-500 mt-2">
            Start applying to jobs and they will appear here.
          </p>

        </div>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {jobs.map((job) => (

            <div
              key={job.id}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition border border-gray-100"
            >

              {/* Job Title */}
              <h2 className="text-xl font-bold">
                {job.title}
              </h2>

              <p className="text-gray-500 mb-4">
                {job.company}
              </p>

              {/* Job Details */}
              <div className="space-y-2 text-sm">

                <div className="flex items-center gap-2">
                  <IndianRupee size={16} className="text-green-600" />
                  {job.package}
                </div>

                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-red-500" />
                  {job.location}
                </div>

                <div className="flex items-center gap-2">
                  <Briefcase size={16} className="text-blue-500" />
                  {job.type}
                </div>

              </div>

              {/* Applied Tag */}
              <div className="mt-6 flex justify-between items-center">

                <span className="flex items-center gap-1 text-green-600 text-sm">
                  <CalendarCheck size={16} />
                  Applied
                </span>

                <button className="text-blue-600 text-sm font-medium hover:underline">
                  View Job
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );
};

export default AppliedJobs;