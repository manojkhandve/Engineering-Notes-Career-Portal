import React, { useState } from "react";
import { User, Edit3, Mail, Activity } from "lucide-react";

const Profile = () => {

  // default user data (later connect backend)
  const [user, setUser] = useState({
    name: "Manoj Khandve",
    email: "manoj@email.com",
    role: "Student / Job Seeker",
    profilePic: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
  });

  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState(user);

  const handleSave = () => {
    setUser(formData);
    setEditing(false);
  };

  return (
    <div className="mt-16 md:mt-0 md:ml-64 p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-8">
        My Profile 👤
      </h1>

      {/* PROFILE CARD */}
      <div className="bg-white rounded-2xl shadow-md p-8 max-w-4xl mx-auto">

        <div className="flex flex-col md:flex-row items-center gap-8">

          {/* PROFILE IMAGE */}
          <div className="relative">

            <img
              src={user.profilePic}
              alt="profile"
              className="w-32 h-32 rounded-full border-4 border-blue-100"
            />

            <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full">
              <Edit3 size={16} />
            </button>

          </div>

          {/* USER INFO */}
          <div className="flex-1 w-full">

            {editing ? (
              <>
                <input
                  className="border p-2 rounded w-full mb-3"
                  value={formData.name}
                  onChange={(e)=>setFormData({...formData,name:e.target.value})}
                />

                <input
                  className="border p-2 rounded w-full mb-3"
                  value={formData.email}
                  onChange={(e)=>setFormData({...formData,email:e.target.value})}
                />

                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <User size={20} />
                  {user.name}
                </h2>

                <p className="text-gray-600 flex items-center gap-2 mt-2">
                  <Mail size={18}/>
                  {user.email}
                </p>

                <p className="text-blue-600 mt-2">
                  {user.role}
                </p>

                <button
                  onClick={()=>setEditing(true)}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Edit Profile
                </button>
              </>
            )}

          </div>

        </div>
      </div>


      {/* ACTIVITY SECTION */}
      <div className="mt-10 max-w-4xl mx-auto">

        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Activity size={20}/>
          Recent Activity
        </h2>

        <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">

          <p>✅ Completed ATS Resume Check</p>
          <p>📘 Attempted Aptitude Test</p>
          <p>💻 Practiced Technical MCQ</p>
          <p>🎯 Updated Profile Information</p>

        </div>

      </div>

    </div>
  );
};

export default Profile;
