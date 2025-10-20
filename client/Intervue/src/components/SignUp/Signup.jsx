import React, { useState } from 'react'
import { FaJava, FaPython, FaJsSquare, FaEye, FaEyeSlash, FaCode } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { signup } from '../../apiCalls/authCalls.js'

function Signup() {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    // Navigate to Login Page
    function handleclick() {
        navigate('/login')
    }

    //Handle Signup
    async function handleSubmit(e) {
        e.preventDefault();
        if (!name || !email || !password) {
            alert("Please fill in all fields");
            return;
        }
        if (password.length < 6) {
            alert("Password must be at least 6 characters long");
            return;
        }
        // Prepare user data
        const userData = { name, email, password };
        try {
            const response = await signup(userData);
            if (response.status === 201) {
                // Signup successful, navigate to login page
                alert("Signup successful!");
                navigate('/dashboard');
            } else {
                console.error("Signup failed with status:", response.status);
            }
            // Reset form fields
            setName('');
            setEmail('');
            setPassword('');
        } catch (error) {
            console.error("Error during signup:", error);
        }
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col lg:flex-row'>
            {/* Left Info Card */}
            <div className='bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white w-full lg:w-2/5 xl:w-1/3 flex flex-col items-center justify-center p-6 sm:p-8 lg:p-12 relative overflow-hidden'>
                {/* Background Pattern */}
                <div className='absolute inset-0 opacity-10'>
                    <div className='absolute top-10 left-10 w-32 h-32 border border-white rounded-full'></div>
                    <div className='absolute bottom-20 right-10 w-24 h-24 border border-white rounded-full'></div>
                    <div className='absolute top-1/2 right-1/4 w-16 h-16 border border-white rounded-full'></div>
                </div>
                
                <div className='relative z-10 text-center max-w-md'>
                    <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 flex items-center justify-center gap-3'>
                        <FaCode className='text-2xl sm:text-3xl lg:text-4xl'/>
                        Intervue
                    </h1>
                    <p className='text-lg sm:text-xl font-semibold mb-3 sm:mb-4'>
                        Prepare, Practice, and Excel—Join Intervue Today.
                    </p>
                    <p className='text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 opacity-90'>
                        Intervue helps you sharpen your coding, problem-solving, and technical knowledge.
                        Practice mock interviews tailored for computer science students, receive AI-powered
                        feedback instantly, and track your growth with a personalized dashboard.
                    </p>

                    {/* Programming Language Icons */}
                    <div className='flex justify-center gap-4 sm:gap-6'>
                        <div className='bg-white/10 backdrop-blur-sm p-3 sm:p-4 rounded-full hover:bg-white/20 transition-all duration-300 transform hover:scale-110'>
                            <FaJava className='text-white text-2xl sm:text-3xl lg:text-4xl' />
                        </div>
                        <div className='bg-white/10 backdrop-blur-sm p-3 sm:p-4 rounded-full hover:bg-white/20 transition-all duration-300 transform hover:scale-110'>
                            <FaJsSquare className='text-white text-2xl sm:text-3xl lg:text-4xl' />
                        </div>
                        <div className='bg-white/10 backdrop-blur-sm p-3 sm:p-4 rounded-full hover:bg-white/20 transition-all duration-300 transform hover:scale-110'>
                            <FaPython className='text-white text-2xl sm:text-3xl lg:text-4xl' />
                        </div>
                    </div>
                </div>
            </div>

            {/* Right SignUp Form */}
            <div className='bg-white flex-1 flex flex-col justify-center p-6 sm:p-8 lg:p-16 xl:p-20'>
                {/* Top Navigation Bar */}
                <div className='flex flex-col sm:flex-row justify-between sm:justify-end items-center gap-3 sm:gap-6 mb-8 sm:mb-12 lg:mb-14'>
                    <p className='text-gray-600 text-sm sm:text-base'>Already have an account?</p>
                    <button 
                        className='bg-transparent border-2 border-blue-600 text-blue-600 px-6 py-2 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300 font-medium text-sm sm:text-base'
                        onClick={handleclick}
                    >
                        Login
                    </button>
                </div>

                <div className='max-w-md mx-auto w-full'>
                    <h2 className='text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 text-center text-gray-800'>
                        Create Your Account
                    </h2>
                    <p className='text-gray-600 text-center mb-6 sm:mb-8 text-sm sm:text-base'>
                        Join thousands of students preparing for technical interviews
                    </p>
                    
                    <div className='flex flex-col gap-4 sm:gap-6'>
                        <div className='relative'>
                            <input
                                type='text'
                                placeholder='Full Name'
                                className='w-full border-2 border-gray-200 rounded-xl p-3 sm:p-4 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-300 text-sm sm:text-base'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        
                        <div className='relative'>
                            <input
                                type='email'
                                placeholder='Email Address'
                                className='w-full border-2 border-gray-200 rounded-xl p-3 sm:p-4 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-300 text-sm sm:text-base'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {/* Password with Eye Icon */}
                        <div className='relative'>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder='Password (min. 6 characters)'
                                className='w-full border-2 border-gray-200 rounded-xl p-3 sm:p-4 pr-12 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-300 text-sm sm:text-base'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type='button'
                                className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200'
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEye size={18} /> : <FaEyeSlash size={18} />}
                            </button>
                        </div>

                        <button
                            onClick={handleSubmit}
                            className='bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-3 sm:p-4 mt-2 sm:mt-4 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold text-sm sm:text-base'
                        >
                            Create Account
                        </button>
                    </div>

                    {/* Terms and Privacy */}
                    <p className='text-xs sm:text-sm text-gray-500 text-center mt-4 sm:mt-6 leading-relaxed'>
                        By creating an account, you agree to our{' '}
                        <span className='text-blue-600 hover:text-blue-700 cursor-pointer underline'>
                            Terms of Service
                        </span>{' '}
                        and{' '}
                        <span className='text-blue-600 hover:text-blue-700 cursor-pointer underline'>
                            Privacy Policy
                        </span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Signup