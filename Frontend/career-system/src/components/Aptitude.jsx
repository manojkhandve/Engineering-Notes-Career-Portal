import React from "react";
import {
  Brain,
  Calculator,
  Mic,
  Code,
  MessageSquare
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const aptitudeSections = [
  {
    title: "Quantitative Aptitude",
    desc: "Practice maths, numerical ability, speed calculations and problem solving.",
    icon: <Calculator size={28} />,
    path: "/quantitative"
  },
  {
    title: "English Communication",
    desc: "Grammar questions + Speak on topics to improve communication skills.",
    icon: <Mic size={28} />,
    path: "/english-communication"
  },
  {
    title: "Technical MCQ",
    desc: "Programming, CS fundamentals, interview-level technical questions.",
    icon: <Code size={28} />,
    path: "/technical-mcq"
  },
  {
    title: "Logical Reasoning",
    desc: "Improve analytical thinking, puzzles, patterns and logical tests.",
    icon: <Brain size={28} />,
    path: "/logical-reasoning"
  },
  {
    title: "Verbal Ability",
    desc: "Vocabulary, sentence correction, comprehension and verbal skills.",
    icon: <MessageSquare size={28} />,
    path: "/verbal-ability"
  },
];

const Aptitude = () => {

  const navigate = useNavigate();

  return (
    <div className="mt-16 md:mt-0 p-6 md:p-10 bg-gray-50 min-h-screen md:ml-64">

      {/* HEADER */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold">
          Aptitude Preparation Hub 🚀
        </h1>

        <p className="text-gray-600 mt-3">
          Practice aptitude, communication skills and technical questions for placements.
        </p>
      </div>

      {/* CARD GRID */}
      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {aptitudeSections.map((item, index) => (

          <div
            key={index}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 group"
          >

            <div className="text-blue-600 mb-4 group-hover:scale-110 transition">
              {item.icon}
            </div>

            <h2 className="text-xl font-semibold mb-2">
              {item.title}
            </h2>

            <p className="text-gray-600 text-sm">
              {item.desc}
            </p>

            <button
              onClick={() => navigate(item.path)}
              className="mt-5 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Start Practice
            </button>

          </div>

        ))}

      </div>
    </div>
  );
};

export default Aptitude;