import React from 'react'
import ScrollReveal from '../../../Reactbits/ScrollReveal/ScrollReveal.jsx'
import CardSwap, { Card } from '../../../Reactbits/CardSwap/CardSwap.jsx'
import dashboardScreenShot from '../../assets/Screenshot from 2025-09-11 13-21-44.png'
import editorScreenShot from '../../assets/Screenshot from 2025-09-11 13-23-03.png'
import feedbackScreenShot from '../../assets/Screenshot from 2025-10-20 19-07-48.png'

function Features() {
    return (
        <div className='w-full px-4 sm:px-6 lg:px-8' name='features'>
            <div className='max-w-7xl mx-auto py-16 sm:py-20 lg:py-24'>
                {/* Heading */}
                <div className='text-center mb-12 sm:mb-16 lg:mb-20'>
                    <h1 className='text-blue-700 font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight'>
                        Everything you need to crack your next interview
                    </h1>
                    {/* Optional subtitle for enhanced design */}
                    <div className='mt-4 sm:mt-6'>
                        <div className='w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-700 mx-auto rounded-full'></div>
                    </div>
                </div>

                {/* Text + Card layout */}
                <div className='flex flex-col lg:flex-row items-center gap-8 sm:gap-12 lg:gap-16'>
                    {/* Left: Text */}
                    <div className='w-full lg:w-1/2 text-center lg:text-left order-2 lg:order-1'>
                        <ScrollReveal
                            baseOpacity={0}
                            enableBlur={true}
                            baseRotation={2}
                            blurStrength={5}
                            containerClassName=""
                            textClassName="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 leading-relaxed"
                        >
                            Practice realistic mock interviews, receive instant AI-driven feedback,
                            and track your growth with a personalized dashboard.
                            Sharpen coding, problem-solving, and communication skills —
                            and step into every interview with confidence.
                        </ScrollReveal>
                        
                        {/* Enhanced features list */}
                        <div className='mt-8 sm:mt-10 lg:mt-12 space-y-3 sm:space-y-4'>
                            <div className='flex items-center justify-center lg:justify-start space-x-3'>
                                <div className='w-2 h-2 bg-blue-500 rounded-full flex-shrink-0'></div>
                                <span className='text-sm sm:text-base text-gray-600 font-medium'>Real-time AI feedback</span>
                            </div>
                            <div className='flex items-center justify-center lg:justify-start space-x-3'>
                                <div className='w-2 h-2 bg-blue-500 rounded-full flex-shrink-0'></div>
                                <span className='text-sm sm:text-base text-gray-600 font-medium'>Progress tracking dashboard</span>
                            </div>
                            <div className='flex items-center justify-center lg:justify-start space-x-3'>
                                <div className='w-2 h-2 bg-blue-500 rounded-full flex-shrink-0'></div>
                                <span className='text-sm sm:text-base text-gray-600 font-medium'>Mock interview simulations</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Card Swap */}
                    <div className='w-full lg:w-1/2 flex justify-center relative order-1 lg:order-2'>
                        {/* Background decoration */}
                        <div className='absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl transform rotate-3 scale-105 opacity-30'></div>
                        <div className='absolute inset-0 bg-gradient-to-tl from-purple-50 to-blue-50 rounded-3xl transform -rotate-3 scale-105 opacity-30'></div>
                        
                        {/* Responsive card container */}
                        <div className='relative w-full max-w-sm sm:max-w-md lg:max-w-lg mr-16' style={{ minHeight: '200px' }}>
                            <div className='w-full mt-4 sm:mt-6 lg:mt-8 '>
                                <CardSwap
                                    width={window.innerWidth < 640 ? 280 : window.innerWidth < 768 ? 320 : 360}
                                    height={window.innerWidth < 640 ? 240 : window.innerWidth < 768 ? 290 : 320}
                                    cardDistance={window.innerWidth < 640 ? 40 : 60}
                                    verticalDistance={window.innerWidth < 640 ? 50 : 70}
                                    delay={5000}
                                    pauseOnHover={false}
                                >
                                    <Card className="bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-xl sm:rounded-2xl overflow-hidden border border-gray-100">
                                        <img src={editorScreenShot} alt="Code Editor Interface" className="w-full h-full object-cover"/>
                                        <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/20 to-transparent h-16'></div>
                                    </Card>
                                    <Card className="bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-xl sm:rounded-2xl overflow-hidden border border-gray-100">
                                        <img src={feedbackScreenShot} alt="AI Feedback System" className="w-full h-full object-cover"/>
                                        <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/20 to-transparent h-16'></div>
                                    </Card>
                                    <Card className="bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-xl sm:rounded-2xl overflow-hidden border border-gray-100">
                                        <img src={dashboardScreenShot} alt="Progress Dashboard" className="w-full h-full object-cover"/>
                                        <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/20 to-transparent h-16'></div>
                                    </Card>
                                </CardSwap>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Optional stats section for enhanced design */}
                <div className='mt-16 sm:mt-20 lg:mt-24 text-center'>
                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 lg:gap-12'>
                        <div className='p-4 sm:p-6'>
                            <div className='text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600 mb-2'>10k+</div>
                            <div className='text-sm sm:text-base text-gray-600'>Interviews Practiced</div>
                        </div>
                        <div className='p-4 sm:p-6'>
                            <div className='text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600 mb-2'>95%</div>
                            <div className='text-sm sm:text-base text-gray-600'>Success Rate</div>
                        </div>
                        <div className='p-4 sm:p-6'>
                            <div className='text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600 mb-2'>24/7</div>
                            <div className='text-sm sm:text-base text-gray-600'>AI Support</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Features