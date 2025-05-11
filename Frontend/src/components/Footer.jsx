import React from "react";
import { FaFacebookF, FaInstagram, FaLine } from "react-icons/fa";
import { RiMailLine } from "react-icons/ri";

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-indigo-900 to-blue-700 text-white py-8">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* University Logo and Basic Info */}
          <div className="flex flex-col items-center md:items-start">
            <div className="bg-white p-3 rounded-lg mb-3">
              <img
                src="/msu.png"
                alt="Mahasarakham University Logo"
                className="h-16"
              />
            </div>
            <h3 className="text-xl font-bold mb-2">Equipment Borrowing System</h3>
            <p className="text-sm text-gray-200">
              © {new Date().getFullYear()} Mahasarakham University
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="text-gray-200 hover:text-white transition-colors">
                  About System
                </a>
              </li>
              <li>
                <a href="/how-to-use" className="text-gray-200 hover:text-white transition-colors">
                  How to Use
                </a>
              </li>
              <li>
                <a href="/faq" className="text-gray-200 hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-200 hover:text-white transition-colors">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info and Social Media */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
            <p className="text-sm text-gray-200 mb-2">
              Mahasarakham University<br />
              Khamriang Sub-District, Kantarawichai District<br />
              Maha Sarakham 44150, Thailand
            </p>
            <p className="text-sm text-gray-200 mb-3">
              <span className="font-medium">Tel:</span> +66 4375 4333<br />
              <span className="font-medium">Email:</span> equipment@msu.ac.th
            </p>

            <div className="flex space-x-4 mt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-all"
                title="Facebook"
              >
                <FaFacebookF className="w-5 h-5 text-black" />
              </a>
              <a
                href="https://line.me"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-all"
                title="Line"
              >
                <FaLine className="w-5 h-5 text-black" />
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-all"
                title="Instagram"
              >
                <FaInstagram className="w-5 h-5 text-black" />
              </a>
              <a
                href="mailto:equipment@msu.ac.th"
                className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-all"
                title="Contact Us"
              >
                <RiMailLine className="w-5 h-5 text-black" />
              </a>
            </div>
          </div>
        </div>

        {/* Language Selector and Copyright Line */}
        <div className="border-t border-blue-500 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <select className="bg-indigo-800 text-white py-1 px-3 rounded border border-blue-500 text-sm">
              <option value="th">ภาษาไทย</option>
              <option value="en">English</option>
            </select>
          </div>
          <div className="text-sm text-gray-300">
            All rights reserved. Mahasarakham University Equipment Borrowing System.
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;