import React from "react";
import { Link } from "react-router-dom";

const SidebarAdmin = () => {
  return (

    <div className="hidden md:block fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white p-6">

      <h1 className="text-xl font-bold mb-8">
        Admin Panel
      </h1>

      <ul className="space-y-4">

        <li><Link to="/admin">Dashboard</Link></li>
        <li><Link to="/admin/users">Users</Link></li>
        <li><Link to="/admin/jobs">Jobs</Link></li>
        <li><Link to="/admin/add-job">Add Job</Link></li>

      </ul>

    </div>
  );
};

export default SidebarAdmin;