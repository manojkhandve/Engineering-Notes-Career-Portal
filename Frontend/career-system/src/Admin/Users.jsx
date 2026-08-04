import React, { useEffect, useState } from "react";

const Users = () => {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("users")) || [];
    setUsers(data);
  }, []);

  const deleteUser = (email) => {

    const updated = users.filter((u) => u.email !== email);

    setUsers(updated);
    localStorage.setItem("users", JSON.stringify(updated));
  };

  return (

    <div className="ml-0 md:ml-64 p-6 bg-gray-50 min-h-screen">

      <h1 className="text-2xl font-bold mb-6">
        Users Management
      </h1>

      <div className="bg-white rounded-xl shadow overflow-auto">

        <table className="w-full text-left">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Name</th>
              <th>Email</th>
              <th>College</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u, i) => (
              <tr key={i} className="border-t">

                <td className="p-3">{u.name}</td>
                <td>{u.email}</td>
                <td>{u.college}</td>

                <td>
                  <button
                    onClick={() => deleteUser(u.email)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
};

export default Users;