import React from 'react'
import { FaInstagram, FaGithub, FaEnvelope, FaCode, FaArrowUp, FaLinkedin, FaTwitter } from 'react-icons/fa'
import { Link } from 'react-scroll'

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white w-full mt-16 relative overflow-hidden">
      {/* Background Pattern */}
      <div className='absolute inset-0 opacity-5'>
        <div className='absolute top-10 left-10 w-32 h-32 border border-blue-400 rounded-full'></div>
        <div className='absolute bottom-20 right-16 w-24 h-24 border border-blue-400 rounded-full'></div>
        <div className='absolute top-1/2 right-1/4 w-16 h-16 border border-blue-400 rounded-full'></div>
      </div>

      {/* Top decorative line */}
      <div className="w-full h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700"></div>

      {/* Main Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 sm:gap-12 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-lg">
                <FaCode className="text-white text-xl" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Intervue
              </h1>
            </div>
            <p className="text-gray-300 text-lg mb-6 leading-relaxed max-w-lg mx-auto lg:mx-0">
              AI-powered platform designed exclusively for computer science students to master technical interviews and land their dream jobs.
            </p>           
          </div>

          {/* Quick Links */}
          <div className="text-center lg:text-left">
            <h3 className="text-xl font-bold mb-6 text-blue-400">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center justify-center lg:justify-start gap-2 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-blue-400 transition-all duration-200"></span>
                  Home
                </a>
              </li>
              <li>
                <Link to="features" smooth={true} duration={500} className="text-gray-300 hover:text-blue-400 transition-colors duration-200 cursor-pointer flex items-center justify-center lg:justify-start gap-2 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-blue-400 transition-all duration-200"></span>
                  Features
                </Link>
              </li>
              <li>
                <Link to="about" smooth={true} duration={500} className="text-gray-300 hover:text-blue-400 transition-colors duration-200 cursor-pointer flex items-center justify-center lg:justify-start gap-2 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-blue-400 transition-all duration-200"></span>
                  About
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center justify-center lg:justify-start gap-2 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-blue-400 transition-all duration-200"></span>
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center justify-center lg:justify-start gap-2 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-blue-400 transition-all duration-200"></span>
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Connect With Us */}
          <div className="text-center lg:text-left">
            <h3 className="text-xl font-bold mb-6 text-blue-400">Connect With Us</h3>
            <div className="flex justify-center lg:justify-start gap-4 mb-6">
              <a href="#" className="bg-gray-800 hover:bg-blue-600 p-3 rounded-full transition-all duration-300 transform hover:scale-110 group">
                <FaInstagram className="text-xl group-hover:text-white" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-gray-700 p-3 rounded-full transition-all duration-300 transform hover:scale-110 group">
                <FaGithub className="text-xl group-hover:text-white" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-blue-500 p-3 rounded-full transition-all duration-300 transform hover:scale-110 group">
                <FaLinkedin className="text-xl group-hover:text-white" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-blue-400 p-3 rounded-full transition-all duration-300 transform hover:scale-110 group">
                <FaTwitter className="text-xl group-hover:text-white" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-red-500 p-3 rounded-full transition-all duration-300 transform hover:scale-110 group">
                <FaEnvelope className="text-xl group-hover:text-white" />
              </a>
            </div>
            
            {/* Contact Info */}
            <div className="space-y-2 text-gray-300 text-sm">
              <p>📧 jenillangaliya09@gmail.com</p>
              <p>📞 +91 9429506350</p>
              <p>📍 India</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-8 border-t border-b border-gray-700 mb-8">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-400 mb-2">100K+</div>
            <div className="text-gray-400 text-sm">Active Students</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-400 mb-2">95%</div>
            <div className="text-gray-400 text-sm">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-400 mb-2">500+</div>
            <div className="text-gray-400 text-sm">Companies</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-400 mb-2">24/7</div>
            <div className="text-gray-400 text-sm">AI Support</div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-gray-400 text-sm text-center sm:text-left">
            &copy; {new Date().getFullYear()} Intervue. All rights reserved. Made with ❤️ for CS students.
          </div>
          
          {/* Back to Top Button */}
          <button 
            onClick={scrollToTop}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg group"
            aria-label="Back to top"
          >
            <FaArrowUp className="text-lg group-hover:animate-bounce" />
          </button>
        </div>
      </div>

      {/* Bottom decorative gradient */}
      <div className="w-full h-1 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500"></div>
    </footer>
  )
}

export default Footer