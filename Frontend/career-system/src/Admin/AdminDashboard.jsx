import React, { useEffect, useState } from "react";

const AdminDashboard = () => {

  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {

    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const storedJobs = JSON.parse(localStorage.getItem("jobs")) || [];

    setUsers(storedUsers);
    setJobs(storedJobs);

  }, []);

  return (

    <div className="ml-0 md:ml-64 p-6 bg-gray-50 min-h-screen">

      <h1 className="text-3xl font-bold mb-8">
        Admin Dashboard
      </h1>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500">Total Users</h2>
          <p className="text-3xl font-bold">{users.length}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500">Total Jobs</h2>
          <p className="text-3xl font-bold">{jobs.length}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500">Active Sessions</h2>
          <p className="text-3xl font-bold">12</p>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;