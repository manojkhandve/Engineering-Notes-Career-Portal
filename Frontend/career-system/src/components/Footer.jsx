import React from "react";
import { GraduationCap, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-10 md:ml-64">

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Logo Section */}
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <GraduationCap size={24} />
              Student Portal
            </h2>

            <p className="mt-3 text-sm">
              A platform where students can check ATS resume score,
              find jobs, practice aptitude tests and download notes.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-3">Quick Links</h3>

            <ul className="space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer">Home</li>
              <li className="hover:text-white cursor-pointer">Jobs</li>
              <li className="hover:text-white cursor-pointer">ATS Checker</li>
              <li className="hover:text-white cursor-pointer">Aptitude</li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-white font-semibold mb-3">Features</h3>

            <ul className="space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer">Resume Analysis</li>
              <li className="hover:text-white cursor-pointer">Placement Practice</li>
              <li className="hover:text-white cursor-pointer">Study Notes</li>
              <li className="hover:text-white cursor-pointer">Career Guidance</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-3">Contact</h3>

            <div className="space-y-3 text-sm">
              <p className="flex items-center gap-2">
                <Mail size={16} /> support@studentportal.com
              </p>

              <p className="flex items-center gap-2">
                <Phone size={16} /> +91 9876543210
              </p>

              <p className="flex items-center gap-2">
                <MapPin size={16} /> India
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Line */}
        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm">
          © {new Date().getFullYear()} Student Portal. All rights reserved.
        </div>

      </div>

    </footer>
  );
};

export default Footer;
