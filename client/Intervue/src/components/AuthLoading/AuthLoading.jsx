import React from 'react';

function AuthLoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
      <div className="text-center">
        {/* Animated Logo/Icon Container */}
        <div className="relative mb-8">
          <div className="w-16 h-16 mx-auto relative">
            {/* Outer rotating ring */}
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-spin"></div>
            {/* Inner pulsing circle */}
            <div className="absolute inset-2 bg-blue-500 rounded-full animate-pulse flex items-center justify-center">
              {/* Lock icon */}
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            {/* Spinning border accent */}
            <div className="absolute inset-0 border-t-4 border-blue-600 rounded-full animate-spin" style={{animationDuration: '0.8s'}}></div>
          </div>
        </div>

        {/* Loading Text */}
        <h2 className="text-2xl font-semibold text-blue-900 mb-2">
          Authenticating
        </h2>
        
        {/* Animated dots */}
        <div className="flex justify-center space-x-1 mb-4">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>

        {/* Subtitle */}
        <p className="text-blue-600 text-sm">
          Verifying your credentials...
        </p>

        {/* Progress bar */}
        <div className="mt-6 w-64 mx-auto">
          <div className="bg-blue-100 rounded-full h-2 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-full rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLoadingScreen;