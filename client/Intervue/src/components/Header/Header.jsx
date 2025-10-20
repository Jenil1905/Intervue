import React from 'react'
import { useNavigate } from 'react-router-dom'

function Header() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col justify-center items-center relative overflow-hidden px-4 sm:px-6 lg:px-8'>
      {/* Background Pattern */}
      <div className='absolute inset-0 opacity-5'>
        <div className='absolute top-1/4 left-1/4 w-64 h-64 border border-blue-400 rounded-full animate-pulse'></div>
        <div className='absolute bottom-1/4 right-1/4 w-48 h-48 border border-blue-400 rounded-full animate-pulse' style={{animationDelay: '1s'}}></div>
        <div className='absolute top-1/2 left-1/6 w-32 h-32 border border-blue-400 rounded-full animate-pulse' style={{animationDelay: '2s'}}></div>
        <div className='absolute bottom-1/3 right-1/6 w-40 h-40 border border-blue-400 rounded-full animate-pulse' style={{animationDelay: '3s'}}></div>
      </div>

      {/* Main Content */}
      <div className='relative z-10 text-center max-w-6xl mx-auto'>
        {/* Badge */}
        <div className='mb-6 sm:mb-8'>
          <span className='inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm sm:text-base font-semibold px-6 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300'>
            🎯 AI-Powered Interview Preparation
          </span>
        </div>

        {/* Main Headline */}
        <h1 className='text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8 leading-tight'>
          <span className='text-gray-900 block mb-2 sm:mb-4'>
            Interviews Aren't Scary
          </span>
          <div className='relative inline-block'>
            <h2 className='bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold px-6 sm:px-8 lg:px-12 py-4 sm:py-6 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden'>
              <span className='relative z-10'>Unpreparedness is!!</span>
              {/* Animated background shine */}
              <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] animate-shine'></div>
            </h2>
          </div>
        </h1>

        {/* Description */}
        <div className='max-w-4xl mx-auto mb-8 sm:mb-12'>
          <p className='text-lg sm:text-xl lg:text-2xl text-gray-700 leading-relaxed px-4'>
            <span className='font-semibold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent'>
              Intervue
            </span>{' '}
            is an AI-powered platform designed exclusively for computer science students to prepare for technical interviews.
            From coding challenges and mock HR rounds to instant feedback and progress tracking,
            Intervue helps you build confidence and master every stage of the interview process.
          </p>
        </div>

        {/* Key Features Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16 max-w-5xl mx-auto'>
          <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border border-blue-100'>
            <div className='text-3xl sm:text-4xl mb-4'>🤖</div>
            <h3 className='text-lg sm:text-xl font-bold text-gray-800 mb-3'>AI-Powered Feedback</h3>
            <p className='text-gray-600 text-sm sm:text-base'>Get instant, personalized feedback on your interview performance</p>
          </div>
          
          <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border border-blue-100'>
            <div className='text-3xl sm:text-4xl mb-4'>💻</div>
            <h3 className='text-lg sm:text-xl font-bold text-gray-800 mb-3'>Coding Challenges</h3>
            <p className='text-gray-600 text-sm sm:text-base'>Practice with real coding problems from top tech companies</p>
          </div>
          
          <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border border-blue-100 sm:col-span-2 lg:col-span-1'>
            <div className='text-3xl sm:text-4xl mb-4'>📊</div>
            <h3 className='text-lg sm:text-xl font-bold text-gray-800 mb-3'>Progress Tracking</h3>
            <p className='text-gray-600 text-sm sm:text-base'>Monitor your improvement with detailed analytics and insights</p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className='flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-gray-500 text-sm sm:text-base'>
          <div className='flex items-center gap-2'>
            <span className='text-green-500'>✓</span>
            <span>Free to Start</span>
          </div>
          <div className='flex items-center gap-2'>
            <span className='text-green-500'>✓</span>
            <span>No Credit Card Required</span>
          </div>
          <div className='flex items-center gap-2'>
            <span className='text-green-500'>✓</span>
            <span>Join 100k+ Students</span>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes shine {
          to {
            transform: translateX(100%) skewX(-12deg);
          }
        }
        .animate-shine {
          animation: shine 2s infinite;
        }
      `}</style>
    </div>
  )
}

export default Header