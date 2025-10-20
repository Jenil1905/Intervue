import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { generateInterviewFeedback, getInterviewFeedback } from '../../apiCalls/feedback.js';
import BeatLoader from 'react-spinners/BeatLoader';
import { CheckCircle, XCircle, AlertCircle, TrendingUp, Target, BookOpen, Home } from 'lucide-react';

function Feedback() {
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const { interviewId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                setLoading(true);
                
                // First try to get existing feedback
                try {
                    const existingFeedback = await getInterviewFeedback(interviewId);
                    if (existingFeedback.success) {
                        setFeedback(existingFeedback.data);
                        setLoading(false);
                        return;
                    }
                } catch (err) {
                    console.log('No existing feedback found, generating new one');
                }

                // If no existing feedback, generate new one
                // Get completion data from localStorage or URL params
                const completionData = JSON.parse(localStorage.getItem(`interview_${interviewId}_completion`) || '{}');
                
                const response = await generateInterviewFeedback(interviewId, {
                    completionStatus: completionData.completionStatus || 'incomplete',
                    violationType: completionData.violationType || null,
                    totalTimeSpent: completionData.totalTimeSpent || 0
                });

                if (response.success) {
                    setFeedback(response.data);
                    // Clear completion data from localStorage
                    localStorage.removeItem(`interview_${interviewId}_completion`);
                } else {
                    throw new Error(response.message || 'Failed to generate feedback');
                }

            } catch (err) {
                console.error('Error loading feedback:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (interviewId) {
            fetchFeedback();
        }
    }, [interviewId]);

    const getScoreColor = (score, maxScore) => {
        const percentage = (score / maxScore) * 100;
        if (percentage >= 80) return 'text-green-400';
        if (percentage >= 60) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getScoreIcon = (score, maxScore) => {
        const percentage = (score / maxScore) * 100;
        if (percentage >= 80) return <CheckCircle className="w-5 h-5 text-green-400" />;
        if (percentage >= 60) return <AlertCircle className="w-5 h-5 text-yellow-400" />;
        return <XCircle className="w-5 h-5 text-red-400" />;
    };

    const getOverallGrade = (score) => {
        if (score >= 90) return { grade: 'A+', color: 'text-green-400' };
        if (score >= 80) return { grade: 'A', color: 'text-green-400' };
        if (score >= 70) return { grade: 'B+', color: 'text-blue-400' };
        if (score >= 60) return { grade: 'B', color: 'text-blue-400' };
        if (score >= 50) return { grade: 'C+', color: 'text-yellow-400' };
        if (score >= 40) return { grade: 'C', color: 'text-yellow-400' };
        return { grade: 'F', color: 'text-red-400' };
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="text-center text-white">
                    <BeatLoader color="#3b82f6" size={20} />
                    <p className="mt-4 text-lg">Generating your interview feedback...</p>
                    <p className="text-sm text-gray-400 mt-2">Our AI is analyzing your performance</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center p-8">
                <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full text-center text-white">
                    <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-4">Error Loading Feedback</h2>
                    <p className="text-gray-300 mb-6">{error}</p>
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (!feedback) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="text-white text-center">
                    <p>No feedback available</p>
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="mt-4 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const overallGrade = getOverallGrade(feedback.overallScore);

    return (
        <div className="min-h-screen bg-gray-950 text-white p-6">
            <div className="max-w-6xl mx-auto">
                
                {/* Header */}
                <div className="bg-gray-900 rounded-lg p-6 mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Interview Feedback</h1>
                            <p className="text-gray-400">Comprehensive analysis of your performance</p>
                        </div>
                        <button 
                            onClick={() => navigate('/dashboard')}
                            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
                        >
                            <Home className="w-4 h-4" />
                            Go to Dashboard
                        </button>
                    </div>
                </div>

                {/* Overall Score Card */}
                <div className="bg-gray-900 rounded-lg p-8 mb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* Score Display */}
                        <div className="text-center">
                            <div className="text-6xl font-bold mb-2">
                                <span className={getOverallGrade(feedback.overallScore).color}>
                                    {feedback.overallScore}
                                </span>
                                <span className="text-gray-400 text-3xl">/100</span>
                            </div>
                            <div className="text-2xl font-semibold mb-2">
                                <span className={overallGrade.color}>Grade: {overallGrade.grade}</span>
                            </div>
                            <div className="text-gray-400">
                                {feedback.completedQuestions}/{feedback.totalQuestions} Questions Completed
                            </div>
                        </div>

                        {/* Status & Progress */}
                        <div className="flex flex-col justify-center">
                            <div className="mb-4">
                                <div className="flex items-center gap-3 mb-2">
                                    {feedback.interviewStatus === 'completed' 
                                        ? <CheckCircle className="w-6 h-6 text-green-400" />
                                        : <XCircle className="w-6 h-6 text-red-400" />
                                    }
                                    <span className="text-lg font-semibold capitalize">
                                        {feedback.interviewStatus === 'completed' ? 'Interview Completed' : 
                                         feedback.interviewStatus === 'terminated' ? 'Interview Terminated' : 
                                         'Interview Incomplete'}
                                    </span>
                                </div>
                                
                                {feedback.terminationReason && (
                                    <p className="text-red-400 text-sm ml-9">
                                        Reason: {feedback.terminationReason.replace('_', ' ')}
                                    </p>
                                )}
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                                <div 
                                    className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                                    style={{width: `${(feedback.completedQuestions / feedback.totalQuestions) * 100}%`}}
                                ></div>
                            </div>
                            <p className="text-sm text-gray-400">
                                Progress: {Math.round((feedback.completedQuestions / feedback.totalQuestions) * 100)}%
                            </p>
                        </div>

                        {/* Quick Stats */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <TrendingUp className="w-5 h-5 text-green-400" />
                                <div>
                                    <p className="font-semibold">Strengths</p>
                                    <p className="text-sm text-gray-400">{feedback.strengths.length} identified</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Target className="w-5 h-5 text-yellow-400" />
                                <div>
                                    <p className="font-semibold">Improvements</p>
                                    <p className="text-sm text-gray-400">{feedback.improvements.length} areas</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <BookOpen className="w-5 h-5 text-blue-400" />
                                <div>
                                    <p className="font-semibold">Questions</p>
                                    <p className="text-sm text-gray-400">{feedback.questionFeedback.length} analyzed</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Overall Feedback */}
                <div className="bg-gray-900 rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                        <BookOpen className="w-6 h-6 text-blue-400" />
                        Overall Assessment
                    </h2>
                    <p className="text-gray-300 leading-relaxed">{feedback.overallFeedback}</p>
                </div>

                {/* Strengths & Improvements */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    
                    {/* Strengths */}
                    <div className="bg-gray-900 rounded-lg p-6">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-3 text-green-400">
                            <TrendingUp className="w-5 h-5" />
                            Strengths
                        </h3>
                        <ul className="space-y-3">
                            {feedback.strengths.map((strength, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-300">{strength}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Areas for Improvement */}
                    <div className="bg-gray-900 rounded-lg p-6">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-3 text-yellow-400">
                            <Target className="w-5 h-5" />
                            Areas for Improvement
                        </h3>
                        <ul className="space-y-3">
                            {feedback.improvements.map((improvement, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-300">{improvement}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Question-wise Feedback */}
                <div className="space-y-6 mb-8">
                    <h2 className="text-2xl font-bold mb-6">Question-wise Analysis</h2>
                    
                    {feedback.questionFeedback.map((qFeedback, index) => (
                        <div key={index} className="bg-gray-900 rounded-lg p-6">
                            
                            {/* Question Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-3">
                                        Question {qFeedback.questionNo}
                                        {getScoreIcon(qFeedback.marksAwarded, qFeedback.maxMarks)}
                                    </h3>
                                    <p className="text-gray-300 mb-3">{qFeedback.question}</p>
                                </div>
                                <div className="text-right">
                                    <div className={`text-2xl font-bold ${getScoreColor(qFeedback.marksAwarded, qFeedback.maxMarks)}`}>
                                        {qFeedback.marksAwarded}/{qFeedback.maxMarks}
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        {Math.round((qFeedback.marksAwarded / qFeedback.maxMarks) * 100)}%
                                    </div>
                                </div>
                            </div>

                            {/* Score Breakdown */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                {Object.entries(qFeedback.breakdown).map(([category, details]) => (
                                    <div key={category} className="bg-gray-800 rounded-lg p-3">
                                        <div className="text-sm text-gray-400 capitalize mb-1">
                                            {category.replace(/([A-Z])/g, ' $1').trim()}
                                        </div>
                                        <div className={`font-semibold ${getScoreColor(details.score, details.maxScore)}`}>
                                            {details.score}/{details.maxScore}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {details.feedback}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Detailed Feedback */}
                            <div className="mb-4">
                                <h4 className="font-semibold mb-2">Detailed Analysis:</h4>
                                <p className="text-gray-300 leading-relaxed">{qFeedback.detailedFeedback}</p>
                            </div>

                            {/* Suggestions */}
                            {qFeedback.suggestions && qFeedback.suggestions.length > 0 && (
                                <div>
                                    <h4 className="font-semibold mb-2">Suggestions for Improvement:</h4>
                                    <ul className="list-disc list-inside space-y-1 text-gray-300">
                                        {qFeedback.suggestions.map((suggestion, idx) => (
                                            <li key={idx}>{suggestion}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Recommendations */}
                <div className="bg-gray-900 rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                        <BookOpen className="w-6 h-6 text-purple-400" />
                        Career Recommendations
                    </h2>
                    <p className="text-gray-300 leading-relaxed">{feedback.recommendations}</p>
                </div>

                {/* Footer */}
                <div className="text-center">
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
                    >
                        <Home className="w-5 h-5" />
                        Return to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Feedback;
