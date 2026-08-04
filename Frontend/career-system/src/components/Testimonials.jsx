import React, { useState } from "react";
import { Star, MessageSquarePlus, X } from "lucide-react";

const Testimonials = () => {

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    message: "",
  });

  const testimonials = [
    {
      name: "Manoj Khandve",
      role: "Computer Engineering Student",
      text: "ATS checker helped me improve my resume score and I got interview calls quickly!",
    },
    {
      name: "Ganesh Ghule",
      role: "Computer Science Student",
      text: "Aptitude practice section is amazing for placements.",
    },
    {
      name: "Swapnil Dande",
      role: "Final Year Student",
      text: "Job portal helped me find internships easily.its helpful",
    },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);
    alert("Feedback submitted successfully!");

    setFormData({ name: "", role: "", message: "" });
    setShowForm(false);
  };

  return (
    <section className="bg-gray-50 py-12 md:py-16 md:ml-64">

      <div className="max-w-7xl mx-auto px-4 md:px-8">

       
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">

          <div>
            <h2 className="text-2xl md:text-4xl font-bold">
              What Students Say ❤️
            </h2>
            <p className="text-gray-600 mt-2">
              Real feedback from students using our platform
            </p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <MessageSquarePlus size={18} />
            Give Feedback
          </button>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {testimonials.map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >

            
              <div className="flex gap-1 text-yellow-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </div>

              <p className="text-gray-600">"{item.text}"</p>

              <div className="mt-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                  {item.name.charAt(0)}
                </div>

                <div>
                  <h4 className="font-semibold">{item.name}</h4>
                  <p className="text-xs text-gray-500">{item.role}</p>
                </div>
              </div>

            </div>
          ))}

        </div>

      </div>


      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">

          <form
            onSubmit={handleSubmit}
            className="bg-white w-full max-w-lg p-6 rounded-xl shadow-lg space-y-4 relative"
          >

           
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <X />
            </button>

            <h3 className="text-xl font-bold">Give Your Feedback</h3>

            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />

            <input
              type="text"
              name="role"
              placeholder="Your Role (Student, Fresher, etc)"
              value={formData.role}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />

            <textarea
              name="message"
              placeholder="Write your feedback..."
              value={formData.message}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              rows="4"
              required
            />

            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Submit Feedback
            </button>

          </form>

        </div>
      )}

    </section>
  );
};

export default Testimonials;
