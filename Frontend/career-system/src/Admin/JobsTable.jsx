import React, { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

const BASE_URL = "http://localhost:8180/api";

const JobsTable = () => {
  const [jobs, setJobs] = useState([]);
  const [editingJob, setEditingJob] = useState(null);

  // Fetch all jobs
  const fetchJobs = async () => {
    const res = await fetch(`${BASE_URL}/jobs`);
    const data = await res.json();
    setJobs(data);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Delete job
  const deleteJob = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    await fetch(`${BASE_URL}/jobs/${id}`, {
      method: "DELETE"
    });

    fetchJobs();
  };

  // Update job
  const updateJob = async () => {
    await fetch(`${BASE_URL}/jobs/${editingJob.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingJob)
    });

    setEditingJob(null);
    fetchJobs();
  };

  return (
    <div className="ml-0 lg:ml-64 p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">📋 Jobs Management</h1>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Company</th>
              <th className="p-3">Role</th>
              <th className="p-3">Location</th>
              <th className="p-3">Package</th>
              <th className="p-3">Experience</th>
              <th className="p-3">Days Left</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{job.title}</td>
                <td className="p-3">{job.company}</td>
                <td className="p-3">{job.role}</td>
                <td className="p-3">{job.location}</td>
                <td className="p-3">₹ {job.packageValue}</td>
                <td className="p-3">{job.experience}</td>
                <td className="p-3">{job.daysLeft}</td>

                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => setEditingJob(job)}
                    className="p-2 bg-blue-100 text-blue-600 rounded"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => deleteJob(job.id)}
                    className="p-2 bg-red-100 text-red-600 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingJob && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Edit Job</h2>

            <input
              className="input mb-2"
              value={editingJob.title}
              onChange={(e) =>
                setEditingJob({ ...editingJob, title: e.target.value })
              }
            />

            <input
              className="input mb-2"
              value={editingJob.company}
              onChange={(e) =>
                setEditingJob({ ...editingJob, company: e.target.value })
              }
            />

            <input
              className="input mb-2"
              value={editingJob.packageValue}
              onChange={(e) =>
                setEditingJob({ ...editingJob, packageValue: e.target.value })
              }
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setEditingJob(null)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>

              <button
                onClick={updateJob}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobsTable;