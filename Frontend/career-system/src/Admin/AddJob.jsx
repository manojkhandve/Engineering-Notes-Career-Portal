import React, { useState } from "react";
import axios from "axios";
import {
  Briefcase,
  Building2,
  IndianRupee,
  FileText,
  MapPin,
  Clock3,
} from "lucide-react";

const AddJob = () => {
  const [job, setJob] = useState({
    title: "",
    company: "",
    role: "",
    type: "",
    location: "",
    experience: "",
    packageValue: "",
    description: "",
    logo: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setJob({
      ...job,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !job.title ||
      !job.company ||
      !job.location ||
      !job.packageValue ||
      !job.description
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...job,
        tags: ["React", "Java", "Full Stack"],
        posted: "Just Now",
        postedDays: 0,
        daysLeft: 30,
        new: true,
      };

      await axios.post(
        "http://localhost:8180/api/jobs",
        payload
      );

      alert("Job Added Successfully!");

      setJob({
        title: "",
        company: "",
        role: "",
        type: "",
        location: "",
        experience: "",
        packageValue: "",
        description: "",
        logo: "",
      });
    } catch (error) {
      console.log(error);
      alert("Failed to add job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ml-0 md:ml-64 min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 p-6 flex items-center justify-center">
      
      <div className="w-full max-w-4xl bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl overflow-hidden border border-gray-200">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Add New Job
          </h1>

          <p className="text-blue-100 mt-2">
            Create and publish new job opportunities
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Job Title */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Job Title
            </label>

            <div className="relative">
              <Briefcase
                className="absolute left-3 top-3.5 text-gray-400"
                size={20}
              />

              <input
                type="text"
                name="title"
                value={job.title}
                onChange={handleChange}
                placeholder="Frontend Developer"
                className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Company */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Company Name
            </label>

            <div className="relative">
              <Building2
                className="absolute left-3 top-3.5 text-gray-400"
                size={20}
              />

              <input
                type="text"
                name="company"
                value={job.company}
                onChange={handleChange}
                placeholder="Google"
                className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Role
            </label>

            <input
              type="text"
              name="role"
              value={job.role}
              onChange={handleChange}
              placeholder="Frontend Engineer"
              className="w-full border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Type */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Job Type
            </label>

            <select
              name="type"
              value={job.type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Type</option>
              <option value="Full Time">Full Time</option>
              <option value="Internship">Internship</option>
              <option value="Part Time">Part Time</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Location
            </label>

            <div className="relative">
              <MapPin
                className="absolute left-3 top-3.5 text-gray-400"
                size={20}
              />

              <input
                type="text"
                name="location"
                value={job.location}
                onChange={handleChange}
                placeholder="Pune, India"
                className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Experience */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Experience
            </label>

            <div className="relative">
              <Clock3
                className="absolute left-3 top-3.5 text-gray-400"
                size={20}
              />

              <input
                type="text"
                name="experience"
                value={job.experience}
                onChange={handleChange}
                placeholder="0-2 Years"
                className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Package */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Package
            </label>

            <div className="relative">
              <IndianRupee
                className="absolute left-3 top-3.5 text-gray-400"
                size={20}
              />

              <input
                type="text"
                name="packageValue"
                value={job.packageValue}
                onChange={handleChange}
                placeholder="8 LPA"
                className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Logo */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Company Logo URL
            </label>

            <input
              type="text"
              name="logo"
              value={job.logo}
              onChange={handleChange}
              placeholder="https://logo-url.com"
              className="w-full border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Job Description
            </label>

            <div className="relative">
              <FileText
                className="absolute left-3 top-3 text-gray-400"
                size={20}
              />

              <textarea
                rows="6"
                name="description"
                value={job.description}
                onChange={handleChange}
                placeholder="Write detailed job description..."
                className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
          </div>

          {/* Button */}
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.01] transition-all duration-300 text-white font-semibold py-4 rounded-xl shadow-lg disabled:opacity-70"
            >
              {loading ? "Adding Job..." : "Add Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddJob;