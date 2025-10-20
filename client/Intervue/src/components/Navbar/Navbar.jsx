import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-scroll'
import { FaCode, FaBars, FaTimes } from 'react-icons/fa'

function Navbar() {
    const navigate = useNavigate()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    function handleSignup() {
        navigate('/signup')
        setIsMenuOpen(false)
    }

    function handleLogin() {
        navigate('/login')
        setIsMenuOpen(false)
    }

    function toggleMenu() {
        setIsMenuOpen(!isMenuOpen)
    }

    function handleLinkClick() {
        setIsMenuOpen(false)
    }

    return (
        <>
            {/* Main Navbar */}
            <div className='bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 backdrop-blur-sm bg-opacity-95 p-4 m-2 sm:m-4 rounded-xl shadow-lg border border-blue-600/20 sticky top-2 z-50'>
                <div className='flex justify-between items-center'>
                    {/* Logo and Navigation Links */}
                    <div className='flex items-center gap-4 lg:gap-8'>
                        {/* Logo */}
                        <h1 className='text-white text-2xl sm:text-3xl font-bold flex items-center gap-2 cursor-pointer hover:text-blue-200 transition-colors duration-300'>
                            <FaCode className='text-blue-200'/>
                            <span className='bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent'>
                                Intervue
                            </span>
                        </h1>

                        {/* Desktop Navigation Links */}
                        <div className='hidden md:flex items-center gap-6 lg:gap-8'>
                            <Link 
                                to="features" 
                                smooth={true} 
                                duration={500} 
                                className='text-white text-lg font-medium hover:text-blue-200 hover:cursor-pointer transition-all duration-300 relative group px-3 py-2'
                            >
                                Features
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-200 transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                            <Link 
                                to="about" 
                                smooth={true} 
                                duration={500} 
                                className='text-white text-lg font-medium hover:text-blue-200 hover:cursor-pointer transition-all duration-300 relative group px-3 py-2'
                            >
                                About
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-200 transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                            <Link 
                                to="contact" 
                                smooth={true} 
                                duration={500} 
                                className='text-white text-lg font-medium hover:text-blue-200 hover:cursor-pointer transition-all duration-300 relative group px-3 py-2'
                            >
                                Contact
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-200 transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        </div>
                    </div>

                    {/* Desktop Action Buttons */}
                    <div className='hidden md:flex items-center gap-3 lg:gap-4'>
                        {/* Login Button */}
                        <button 
                            className="text-lg text-white px-4 lg:px-6 py-2 group cursor-pointer hover:text-blue-200 transition-all duration-300 font-medium" 
                            onClick={handleLogin}
                        >
                            Login
                            <span className="ml-2 inline-block transform transition-transform duration-300 group-hover:translate-x-1">
                                →
                            </span>
                        </button>

                        {/* SignUp Button */}
                        <button 
                            className='text-lg text-blue-900 bg-white rounded-full px-4 lg:px-6 py-2 font-semibold hover:bg-blue-50 hover:scale-105 transform transition-all duration-300 shadow-md hover:shadow-lg' 
                            onClick={handleSignup}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button 
                        className='md:hidden text-white text-xl p-2 hover:text-blue-200 transition-colors duration-300'
                        onClick={toggleMenu}
                    >
                        {isMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className='fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden' onClick={toggleMenu}></div>
            )}

            {/* Mobile Menu */}
            <div className={`fixed top-0 right-0 h-full w-80 max-w-xs bg-gradient-to-b from-blue-900 to-blue-800 shadow-2xl transform transition-transform duration-300 z-50 md:hidden ${
                isMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}>
                <div className='flex flex-col h-full'>
                    {/* Mobile Menu Header */}
                    <div className='flex justify-between items-center p-6 border-b border-blue-700'>
                        <h2 className='text-white text-xl font-bold flex items-center gap-2'>
                            <FaCode className='text-blue-200'/>
                            Intervue
                        </h2>
                        <button 
                            className='text-white text-xl hover:text-blue-200 transition-colors duration-300'
                            onClick={toggleMenu}
                        >
                            <FaTimes />
                        </button>
                    </div>

                    {/* Mobile Navigation Links */}
                    <div className='flex flex-col py-6 px-6 space-y-4 flex-1'>
                        <Link 
                            to="features" 
                            smooth={true} 
                            duration={500} 
                            className='text-white text-lg font-medium hover:text-blue-200 py-3 px-4 rounded-lg hover:bg-blue-800/50 transition-all duration-300 cursor-pointer'
                            onClick={handleLinkClick}
                        >
                            Features
                        </Link>
                        <Link 
                            to="about" 
                            smooth={true} 
                            duration={500} 
                            className='text-white text-lg font-medium hover:text-blue-200 py-3 px-4 rounded-lg hover:bg-blue-800/50 transition-all duration-300 cursor-pointer'
                            onClick={handleLinkClick}
                        >
                            About
                        </Link>
                        <Link 
                            to="contact" 
                            smooth={true} 
                            duration={500} 
                            className='text-white text-lg font-medium hover:text-blue-200 py-3 px-4 rounded-lg hover:bg-blue-800/50 transition-all duration-300 cursor-pointer'
                            onClick={handleLinkClick}
                        >
                            Contact
                        </Link>

                        {/* Divider */}
                        <div className='border-t border-blue-700 my-6'></div>

                        {/* Mobile Action Buttons */}
                        <button 
                            className="text-white text-lg py-3 px-4 group cursor-pointer hover:text-blue-200 transition-all duration-300 font-medium text-left rounded-lg hover:bg-blue-800/50" 
                            onClick={handleLogin}
                        >
                            Login
                            <span className="ml-2 inline-block transform transition-transform duration-300 group-hover:translate-x-1">
                                →
                            </span>
                        </button>

                        <button 
                            className='text-blue-900 bg-white rounded-xl py-3 px-4 font-semibold hover:bg-blue-50 transition-all duration-300 shadow-md text-lg' 
                            onClick={handleSignup}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Mobile Menu Footer */}
                    <div className='p-6 border-t border-blue-700'>
                        <p className='text-blue-200 text-sm text-center'>
                            Ready to ace your interviews?
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Navbar