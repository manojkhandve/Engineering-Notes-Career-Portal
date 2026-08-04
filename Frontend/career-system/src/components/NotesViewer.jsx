import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const API = "http://localhost:8180/api/notes";

const NotesViewer = () => {
  const [searchParams] = useSearchParams();

  const branch = searchParams.get("branch");
  const year = searchParams.get("year");
  const courseName = (searchParams.get("courseName") || "").toLowerCase();

  const isDiploma = courseName.includes("diploma");

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!branch || !year) return;

    fetch(`${API}?branchId=${branch}&yearId=${year}`)
      .then((res) => res.json())
      .then((data) => {
        setNotes(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [branch, year]);

  const LinkCell = ({ url, label, color }) => {
    const colors = {
      blue: "bg-blue-100 text-blue-700 hover:bg-blue-200",
      green: "bg-green-100 text-green-700 hover:bg-green-200",
      yellow: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
      red: "bg-red-100 text-red-700 hover:bg-red-200",
      purple: "bg-purple-100 text-purple-700 hover:bg-purple-200",
    };

    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className={`inline-block px-3 py-1 rounded-lg font-medium transition text-xs ${colors[color]}`}
      >
        {label}
      </a>
    );
  };

  const degreeColumns = [
    {
      label: "📘 Notes",
      color: "blue",
      getUrl: (note) => `${API}/download/file/${note.id}`,
    },
    {
      label: "📗 DK Notes",
      color: "green",
      getUrl: (note) => `${API}/download/dk/${note.id}`,
    },
    {
      label: "📝 InSem",
      color: "yellow",
      getUrl: (note) => `${API}/download/insem/${note.id}`,
    },
    {
      label: "📄 EndSem",
      color: "red",
      getUrl: (note) => `${API}/download/endsem/${note.id}`,
    },
  ];

  const diplomaColumns = [
    {
      label: "📘 Notes",
      color: "blue",
      getUrl: (note) => `${API}/download/file/${note.id}`,
    },
    {
      label: "📄 Model Answer",
      color: "green",
      getUrl: (note) => `${API}/download/modelanswer/${note.id}`,
    },
    {
      label: "🛠 Microproject",
      color: "purple",
      getUrl: (note) => `${API}/download/microproject/${note.id}`,
    },
  ];

  const columns = isDiploma ? diplomaColumns : degreeColumns;

  return (
    <div className="ml-0 md:ml-64 p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
          📚 Notes Viewer
        </h1>
        <p className="text-gray-500 text-sm capitalize">
          {courseName}
        </p>
      </div>

      {loading && (
        <div className="text-center mt-20 text-gray-500">
          Loading notes...
        </div>
      )}

      {!loading && notes.length === 0 && (
        <div className="text-center mt-20">
          <p className="text-gray-500 text-lg">
            😕 No notes available
          </p>
        </div>
      )}

      {!loading && notes.length > 0 && (
        <div className="overflow-x-auto rounded-2xl shadow border bg-white">
          <table className="w-full text-sm text-left">
            <thead className="bg-blue-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Subject</th>

                {columns.map((col) => (
                  <th key={col.label} className="px-4 py-3">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {notes.map((note, index) => (
                <tr key={note.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{index + 1}</td>

                  <td className="px-4 py-3 font-medium">
                    {note.title}
                  </td>

                  <td className="px-4 py-3">
                    {note.subject?.name}
                  </td>

                  {columns.map((col) => (
                    <td key={col.label} className="px-4 py-3">
                      <LinkCell
                        url={col.getUrl(note)}
                        label={col.label}
                        color={col.color}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default NotesViewer;