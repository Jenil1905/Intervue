import React from 'react'
import AnimatedContent from '../../../Reactbits/AnimatedContent/AnimatedContent.jsx'
import { useNavigate } from 'react-router-dom'
import { FaRobot, FaBolt, FaChartLine, FaArrowRight, FaPlay } from 'react-icons/fa'

function Steps() {
    const navigate = useNavigate()

    function handleClick() {
        navigate('/signup')
    }

    return (
        <div className='bg-gradient-to-br from-blue-50 via-white to-blue-100 py-16 sm:py-20 lg:py-24 overflow-hidden' name='about'>
            {/* Background Pattern */}
            <div className='absolute inset-0 opacity-5'>
                <div className='absolute top-1/4 left-1/4 w-64 h-64 border border-blue-400 rounded-full'></div>
                <div className='absolute bottom-1/4 right-1/4 w-48 h-48 border border-blue-400 rounded-full'></div>
            </div>

            <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <AnimatedContent
                    distance={100}
                    direction="vertical"
                    reverse={false}
                    duration={1.5}
                    ease="bounce.out"
                    initialOpacity={0.0}
                    animateOpacity
                    scale={1.1}
                    threshold={0.1}
                    delay={0.5}
                >
                    <div className='flex flex-col lg:flex-row items-center gap-12 lg:gap-16'>
                        <div>
                            <img src="https://coderpad.io/wp-content/uploads/2025/08/interview-collaborative-coding-ide.png"></img>
                        </div>

                        {/* Right: Enhanced Content Section */}
                        <div className='w-full lg:w-1/2 order-1 lg:order-2 text-center lg:text-left '>
                            {/* Section Header */}
                            <div className='mb-8 sm:mb-12'>
                                <div className='mb-4'>
                                    <span className='inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm sm:text-base font-semibold px-4 py-2 rounded-full'>
                                        🚀 Our Process
                                    </span>
                                </div>
                                <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6'>
                                    <span className='bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent'>
                                        How It Works
                                    </span>
                                </h2>
                                <p className='text-lg sm:text-xl text-gray-700 leading-relaxed max-w-2xl'>
                                    Intervue gives you a complete interview practice experience designed for computer science students.
                                    Practice coding and technical problem-solving, receive instant AI-powered feedback, and track your growth.
                                </p>
                            </div>

                            {/* Enhanced Steps */}
                            <div className='space-y-6 sm:space-y-8 mb-8 sm:mb-12'>
                                {/* Step 1 */}
                                <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-blue-100'>
                                    <div className='flex items-start gap-4'>
                                        <div className='bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-xl flex-shrink-0'>
                                            <FaRobot className='text-xl' />
                                        </div>
                                        <div>
                                            <h3 className='font-bold text-xl sm:text-2xl text-gray-900 mb-2 flex items-center gap-2'>
                                                AI Interview
                                                <span className='text-blue-600 text-sm bg-blue-100 px-2 py-1 rounded-full'>Step 1</span>
                                            </h3>
                                            <p className='text-gray-700 text-base sm:text-lg leading-relaxed'>
                                                Take realistic mock interviews powered by AI to assess your coding, problem-solving, and communication skills with real-time analysis.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Step 2 */}
                                <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-blue-100'>
                                    <div className='flex items-start gap-4'>
                                        <div className='bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-xl flex-shrink-0'>
                                            <FaBolt className='text-xl' />
                                        </div>
                                        <div>
                                            <h3 className='font-bold text-xl sm:text-2xl text-gray-900 mb-2 flex items-center gap-2'>
                                                Instant Feedback
                                                <span className='text-blue-600 text-sm bg-blue-100 px-2 py-1 rounded-full'>Step 2</span>
                                            </h3>
                                            <p className='text-gray-700 text-base sm:text-lg leading-relaxed'>
                                                Receive detailed AI-driven feedback immediately after each mock interview to help you improve efficiently and identify key areas for growth.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Step 3 */}
                                <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-blue-100'>
                                    <div className='flex items-start gap-4'>
                                        <div className='bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-xl flex-shrink-0'>
                                            <FaChartLine className='text-xl' />
                                        </div>
                                        <div>
                                            <h3 className='font-bold text-xl sm:text-2xl text-gray-900 mb-2 flex items-center gap-2'>
                                                Progress Dashboard
                                                <span className='text-blue-600 text-sm bg-blue-100 px-2 py-1 rounded-full'>Step 3</span>
                                            </h3>
                                            <p className='text-gray-700 text-base sm:text-lg leading-relaxed'>
                                                Track your growth over time with a personalized dashboard that summarizes your performance, strengths, and provides actionable insights.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Enhanced CTA Section */}
                            <div className='space-y-4'>
                                <div className='flex flex-col sm:flex-row gap-4 justify-center lg:justify-start'>
                                    <button
                                        className='bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-lg px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center gap-2'
                                        onClick={handleClick}
                                    >
                                        Discover Intervue
                                        <FaArrowRight className='text-sm group-hover:translate-x-1 transition-transform duration-200' />
                                    </button>
                                </div>

                                {/* Trust Indicators */}
                                <div className='flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 text-gray-500 text-sm'>
                                    <div className='flex items-center gap-2'>
                                        <span className='text-green-500'>✓</span>
                                        <span>Free Trial Available</span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <span className='text-green-500'>✓</span>
                                        <span>No Setup Required</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </AnimatedContent>
            </div>
        </div>
    )
}

export default Steps