import React, { useState } from "react";
import quantQuestions from "../data/quantQuestions";

const topics = [
  { key: "percentage", name: "Percentage" },
  { key: "profitLoss", name: "Profit & Loss" },
  { key: "timeWork", name: "Time & Work" },
  { key: "ratio", name: "Ratio & Proportion" },
];

const Quantitative = () => {

  const [selectedTopic, setSelectedTopic] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const questions = selectedTopic ? quantQuestions[selectedTopic] : [];

  const handleOption = (option) => {
    setAnswers({
      ...answers,
      [current]: option,
    });
  };

  const nextQuestion = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    }
  };

  const prevQuestion = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };

  const submitTest = () => {

    let calculatedScore = 0;

    questions.forEach((q, index) => {
      if (answers[index] === q.answer) {
        calculatedScore++;
      }
    });

    setScore(calculatedScore);
    setShowResult(true);
  };

  return (

    <div className="ml-0 md:ml-64 bg-gray-50 min-h-screen p-8">

      {/* TOPIC SELECTION */}

      {!selectedTopic && (

        <div className="max-w-4xl mx-auto">

          <h1 className="text-3xl font-bold mb-8 text-center">
            Select Quantitative Topic
          </h1>

          <div className="grid md:grid-cols-2 gap-6">

            {topics.map((topic) => (

              <div
                key={topic.key}
                onClick={() => setSelectedTopic(topic.key)}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg cursor-pointer"
              >

                <h2 className="text-xl font-semibold">
                  {topic.name}
                </h2>

                <p className="text-gray-500 mt-2">
                  Start practice questions for {topic.name}
                </p>

              </div>

            ))}

          </div>

        </div>

      )}

      {/* QUESTIONS */}

      {selectedTopic && !showResult && (

        <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow">

          <h2 className="text-xl font-bold mb-4">
            Question {current + 1} / {questions.length}
          </h2>

          <p className="text-lg mb-6">
            {questions[current].question}
          </p>

          <div className="space-y-3">

            {questions[current].options.map((option, index) => (

              <button
                key={index}
                onClick={() => handleOption(option)}
                className={`w-full text-left border p-3 rounded-lg
                ${answers[current] === option
                  ? "bg-blue-600 text-white"
                  : "hover:bg-blue-50"}`}
              >
                {option}
              </button>

            ))}

          </div>

          {/* NAVIGATION BUTTONS */}

          <div className="flex justify-between mt-6">

            <button
              onClick={prevQuestion}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Previous
            </button>

            {current === questions.length - 1 ? (

              <button
                onClick={submitTest}
                className="px-6 py-2 bg-green-600 text-white rounded"
              >
                Submit Test
              </button>

            ) : (

              <button
                onClick={nextQuestion}
                className="px-6 py-2 bg-blue-600 text-white rounded"
              >
                Next
              </button>

            )}

          </div>

        </div>

      )}

      {/* RESULT SCREEN */}

      {showResult && (

        <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow text-center">

          <h2 className="text-3xl font-bold mb-4">
            Test Completed 🎉
          </h2>

          <p className="text-xl">
            Your Score: <span className="font-bold">{score}</span> / {questions.length}
          </p>

          <p className="mt-4 text-gray-600">
            Accuracy: {Math.round((score / questions.length) * 100)}%
          </p>

          <p className="mt-3 text-gray-500">
            {score >= questions.length * 0.7
              ? "Great Job! Keep it up 💪"
              : "Keep practicing to improve 🚀"}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded"
          >
            Practice Again
          </button>

        </div>

      )}

    </div>

  );
};

export default Quantitative;