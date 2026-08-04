import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Building2,
  Briefcase,
  Clock,
  IndianRupee,
  ArrowLeft,
} from "lucide-react";
import axios from "axios";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJob();
  }, []);

  const fetchJob = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8180/api/jobs/${id}`
      );

      setJob(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const applyJob = () => {
    const appliedJobs =
      JSON.parse(localStorage.getItem("appliedJobs")) || [];

    const alreadyApplied = appliedJobs.find(
      (j) => j.id === job.id
    );

    if (!alreadyApplied) {
      appliedJobs.push(job);

      localStorage.setItem(
        "appliedJobs",
        JSON.stringify(appliedJobs)
      );

      alert("Application Submitted Successfully ✅");
    } else {
      alert("You already applied for this job");
    }
  };

  if (loading) {
    return (
      <div className="ml-0 md:ml-64 min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-semibold">
          Loading Job Details...
        </h1>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="ml-0 md:ml-64 min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold text-red-500">
          Job Not Found
        </h1>
      </div>
    );
  }

  return (
    <div className="ml-0 md:ml-64 min-h-screen bg-gray-50 p-6 md:p-10">
      
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-200">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
          
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-6 text-blue-100 hover:text-white"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <div className="flex items-center gap-5">
            
            {/* LOGO */}
            <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-bold">
              {job.company?.charAt(0)}
            </div>

            <div>
              <h1 className="text-4xl font-bold">
                {job.title}
              </h1>

              <p className="text-blue-100 mt-2 text-lg">
                {job.company}
              </p>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="p-8">

          {/* JOB INFO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div className="bg-gray-50 rounded-2xl p-5 border">
              <div className="flex items-center gap-3">
                <MapPin className="text-blue-600" />
                <div>
                  <p className="text-gray-500 text-sm">Location</p>
                  <h3 className="font-semibold">
                    {job.location}
                  </h3>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-5 border">
              <div className="flex items-center gap-3">
                <Briefcase className="text-blue-600" />
                <div>
                  <p className="text-gray-500 text-sm">Experience</p>
                  <h3 className="font-semibold">
                    {job.experience}
                  </h3>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-5 border">
              <div className="flex items-center gap-3">
                <IndianRupee className="text-blue-600" />
                <div>
                  <p className="text-gray-500 text-sm">Package</p>
                  <h3 className="font-semibold">
                    {job.packageValue}
                  </h3>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-5 border">
              <div className="flex items-center gap-3">
                <Clock className="text-blue-600" />
                <div>
                  <p className="text-gray-500 text-sm">Job Type</p>
                  <h3 className="font-semibold">
                    {job.type}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4">
              Job Description
            </h2>

            <p className="text-gray-600 leading-8">
              {job.description}
            </p>
          </div>

          {/* EXTRA DETAILS */}
          <div className="mt-10 grid md:grid-cols-2 gap-6">

            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
              <h3 className="font-bold text-lg mb-3">
                Requirements
              </h3>

              <ul className="space-y-2 text-gray-700">
                <li>• Strong communication skills</li>
                <li>• Knowledge of React / Java</li>
                <li>• Team collaboration</li>
                <li>• Problem solving skills</li>
              </ul>
            </div>

            <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
              <h3 className="font-bold text-lg mb-3">
                Benefits
              </h3>

              <ul className="space-y-2 text-gray-700">
                <li>• Health Insurance</li>
                <li>• Flexible Work Hours</li>
                <li>• Remote Work Support</li>
                <li>• Performance Bonus</li>
              </ul>
            </div>

          </div>

          {/* APPLY BUTTON */}
          <button
            onClick={applyJob}
            className="w-full mt-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.01] transition-all duration-300 text-white py-4 rounded-2xl font-semibold text-lg shadow-lg"
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;