import React, { useEffect, useState } from 'react';
import { 
    FaUserCircle, FaUserCog, FaBars, FaTimes, FaHistory, FaCode, 
    FaBriefcase, FaJs, FaGlobe, FaChevronRight, FaJava, FaPython, 
    FaDatabase, FaCalendarAlt, FaChevronDown, FaCheckCircle, FaSpinner, 
    FaClock, FaChartLine, FaSearch
} from 'react-icons/fa';
import { FaArrowRightFromBracket } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { getUserProfile } from '../../apiCalls/userCall.js';
import { getInterviewHistory, startInterview } from '../../apiCalls/interviewCall.js';
import { logout } from '../../apiCalls/authCalls.js';
import { getScheduledInterviews, scheduleInterview } from '../../apiCalls/scheduleInterviewCalls.js'; 
import Logout from '../LogoutMenu/Logout.jsx';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function ScheduleFormModal({ isOpen, selectedDate, onClose, onSchedule, isScheduling }) {
    if (!isOpen) return null;

    const [topic, setTopic] = useState('data-structures-and-algorithms');
    const [time, setTime] = useState('09:00');

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-md text-gray-800 shadow-2xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Schedule Interview</h2>
                <p className="text-sm text-gray-500 mb-6">You have selected: <span className="font-semibold text-blue-600">{selectedDate.toDateString()}</span></p>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Topic</label>
                        <select 
                            value={topic} 
                            disabled={isScheduling}
                            onChange={(e) => setTopic(e.target.value)} 
                            className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
                        >
                            <option value="data-structures-and-algorithms">Data Structures & Algorithms</option>
                            <option value="operating-systems">Operating System</option>
                            <option value="computer-networks">Computer Networks</option>
                            <option value="javascript">JavaScript</option>
                            <option value="java">Java</option>
                            <option value="dbms">DBMS</option>
                            <option value="python">Python</option>
                            <option value="c++">C++</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Time</label>
                        <select 
                            value={time} 
                            disabled={isScheduling}
                            onChange={(e) => setTime(e.target.value)} 
                            className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
                        >
                            <option value="09:00">9:00 AM</option>
                            <option value="11:00">11:00 AM</option>
                            <option value="14:00">2:00 PM</option>
                            <option value="16:00">4:00 PM</option>
                            <option value="18:00">6:00 PM</option>
                            <option value="20:00">8:00 PM</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-8">
                    <button 
                        onClick={onClose} 
                        disabled={isScheduling}
                        className="px-5 py-2.5 rounded-xl border border-gray-300 font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={() => onSchedule(topic, time)} 
                        disabled={isScheduling}
                        className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-md flex items-center gap-2 disabled:opacity-50"
                    >
                        {isScheduling ? (
                            <>
                                <FaSpinner className="animate-spin" />
                                <span>Scheduling...</span>
                            </>
                        ) : (
                            <span>Confirm Schedule</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

function HistoryModal({ isOpen, onClose, interviews, onSelectInterview }) {
    if (!isOpen) return null;
    const [searchTerm, setSearchTerm] = useState('');

    const filteredInterviews = interviews.filter(i => 
        i.topic.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-2xl text-gray-800 shadow-2xl max-h-[85vh] flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <FaHistory className="text-purple-600" /> All Interview History
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                        <FaTimes size={18} />
                    </button>
                </div>

                <div className="relative mb-4">
                    <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search interviews by topic..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                    />
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                    {filteredInterviews.length > 0 ? (
                        filteredInterviews.map((interview) => (
                            <div 
                                key={interview._id} 
                                className="p-4 border border-gray-100 rounded-xl bg-gray-50 hover:bg-blue-50/50 hover:border-blue-200 transition-all flex items-center justify-between"
                            >
                                <div>
                                    <h4 className="font-bold text-gray-900 capitalize text-sm">{interview.topic.replace(/-/g, ' ')}</h4>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {new Date(interview.createdAt).toLocaleString('en-US', {
                                            year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${interview.overallStatus === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {interview.overallStatus === 'completed' ? 'Completed' : 'In Progress'}
                                    </span>
                                    <button 
                                        onClick={() => {
                                            onClose();
                                            onSelectInterview(interview);
                                        }}
                                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors"
                                    >
                                        {interview.overallStatus === 'completed' ? 'View Feedback' : 'Resume'}
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center py-8 text-sm text-gray-500">No interviews match your search.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

function Dashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [interviews, setInterviews] = useState([]);
    const [scheduledInterviews, setScheduledInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isStartingInterview, setIsStartingInterview] = useState(false);
    const [isScheduling, setIsScheduling] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    
    const navigate = useNavigate();
    const [date, setDate] = useState(new Date());
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            const interviewDates = new Set(
                scheduledInterviews.map(interview => new Date(interview.scheduledTime).toDateString())
            );
            if (interviewDates.has(date.toDateString())) {
                return 'relative group bg-blue-50 font-bold text-blue-600 rounded-lg';
            }
        }
        return null;
    };

    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const interviewForThisDay = scheduledInterviews.find(interview => 
                new Date(interview.scheduledTime).toDateString() === date.toDateString()
            );

            if (interviewForThisDay) {
                return (
                    <>
                        <div className="h-1.5 w-1.5 bg-blue-600 rounded-full mx-auto mt-0.5 group-hover:bg-white"></div>
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-44 p-2 bg-gray-900 text-white text-xs rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
                            <p className="font-bold capitalize truncate">{interviewForThisDay.topic.replace(/-/g, ' ')}</p>
                            <p className="text-[10px] text-gray-300 mt-0.5">
                                {new Date(interviewForThisDay.scheduledTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </>
                );
            }
        }
        return null;
    };

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const [profileRes, historyRes, scheduleRes] = await Promise.all([
                    getUserProfile(),
                    getInterviewHistory(),
                    getScheduledInterviews()
                ]);
                setUser(profileRes.data.user);
                setInterviews(historyRes.data.interviews || []);
                setScheduledInterviews(scheduleRes.data.interviews || []);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                if (error.response?.status === 401) {
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [navigate]);

    const handleConfirmLogout = async () => {
        try {
            await logout();
            setIsLogoutModalOpen(false);
            navigate('/');
        } catch (error) {
            console.error("Failed to log out:", error);
        }
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleStartInterview = async (topic) => {
        setIsStartingInterview(true);
        try {
            const res = await startInterview(topic);
            const interviewId = res.data.interviewId || res.data.interview?._id;
            navigate(`/interview/${topic}`, { state: { interviewId } });
        } catch (err) {
            console.error("Failed to start interview:", err);
            // Fallback navigate
            navigate(`/interview/${topic}`);
        } finally {
            setIsStartingInterview(false);
        }
    };

    const handleDateSelect = (selectedDate) => {
        setDate(selectedDate);
        setIsCalendarOpen(false);
        setIsFormOpen(true);
    };

    const handleScheduleConfirm = async (topic, time) => {
        const [hours, minutes] = time.split(':');
        const scheduledDateTime = new Date(date);
        scheduledDateTime.setHours(hours, minutes, 0, 0);

        setIsScheduling(true);
        try {
            await scheduleInterview(topic, scheduledDateTime);
            const scheduleRes = await getScheduledInterviews();
            setScheduledInterviews(scheduleRes.data.interviews || []);
            setIsFormOpen(false);
        } catch (error) {
            console.error("Failed to schedule interview:", error);
        } finally {
            setIsScheduling(false);
        }
    };

    const completedCount = interviews.filter(i => i.overallStatus === 'completed').length;
    const upcomingCount = scheduledInterviews.length;

    return (
        <div className="flex min-h-screen bg-gray-50/50">
            {/* Loading Overlay when launching interview */}
            {isStartingInterview && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-white">
                    <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-xl font-bold">Initializing AI Technical Interviewer...</p>
                    <p className="text-sm text-gray-300 mt-1">Preparing code environment and questions.</p>
                </div>
            )}

            {/* Mobile Sidebar Backdrop */}
            {sidebarOpen && <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 lg:hidden" onClick={toggleSidebar}></div>}

            {/* Sidebar Navigation */}
            <aside className={`
                ${sidebarOpen ? 'translate-x-0 w-72 opacity-100' : '-translate-x-full w-0 opacity-0 pointer-events-none'} 
                fixed lg:relative inset-y-0 left-0 z-50 h-screen bg-gray-900 text-white shadow-2xl transition-all duration-300 ease-in-out flex flex-col overflow-hidden shrink-0
            `}>
                <div className="flex-shrink-0 p-6 border-b border-gray-800">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold flex items-center gap-3">
                            <div className="p-2 bg-blue-600 rounded-xl">
                                <FaCode className="text-white text-lg" />
                            </div>
                            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">Intervue</span>
                        </h1>
                        <button 
                            onClick={toggleSidebar} 
                            title="Close sidebar panel"
                            className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors cursor-pointer"
                        >
                            <FaTimes size={16} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
                    {/* User Mini Profile */}
                    {loading ? (
                        <div className="bg-gray-800/60 rounded-xl p-4 animate-pulse flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
                            <div className="w-2/3 h-4 bg-gray-700 rounded"></div>
                        </div>
                    ) : (
                        <div className="bg-gray-800/60 border border-gray-800 rounded-2xl p-4 flex items-center gap-3">
                            {user?.profile_picture ? (
                                <img src={user.profile_picture} alt="Profile" className="w-11 h-11 rounded-full object-cover border-2 border-blue-500" />
                            ) : (
                                <div className="w-11 h-11 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center font-bold text-white shadow-md">
                                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                            )}
                            <div className="overflow-hidden">
                                <p className="font-semibold text-sm text-white truncate">{user?.name || "User"}</p>
                                <p className="text-xs text-gray-400 truncate">{user?.email || ""}</p>
                            </div>
                        </div>
                    )}

                    {/* Navigation Menu */}
                    <nav className="space-y-1">
                        <a href="/profile" className="flex items-center justify-between px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-xl transition-colors font-medium text-sm cursor-pointer">
                            <div className="flex items-center gap-3">
                                <FaUserCircle className="text-blue-400" size={18} />
                                <span>Profile</span>
                            </div>
                            <FaChevronRight size={12} className="text-gray-500" />
                        </a>
                        <a href="/settings" className="flex items-center justify-between px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-xl transition-colors font-medium text-sm cursor-pointer">
                            <div className="flex items-center gap-3">
                                <FaUserCog className="text-emerald-400" size={18} />
                                <span>Settings</span>
                            </div>
                            <FaChevronRight size={12} className="text-gray-500" />
                        </a>
                        <button 
                            onClick={() => setIsLogoutModalOpen(true)} 
                            className="w-full flex items-center justify-between px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-rose-400 rounded-xl transition-colors font-medium text-sm cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <FaArrowRightFromBracket className="text-rose-400" size={18} />
                                <span>Logout</span>
                            </div>
                            <FaChevronRight size={12} className="text-gray-500" />
                        </button>
                    </nav>

                    {/* Compact Sidebar History (Top 4 items only) */}
                    <div className="pt-4 border-t border-gray-800">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <FaHistory className="text-purple-400" /> Recent History
                            </h2>
                        </div>

                        <div className="space-y-2">
                            {loading ? (
                                <div className="text-xs text-gray-500 bg-gray-800/40 rounded-xl p-3 animate-pulse">Loading history...</div>
                            ) : interviews.length > 0 ? (
                                <>
                                    {interviews.slice(0, 4).map(interview => (
                                        <div 
                                            key={interview._id} 
                                            onClick={() => navigate(`/feedback/${interview._id}`)}
                                            className="bg-gray-800/40 hover:bg-gray-800 border border-gray-800 rounded-xl p-3 cursor-pointer transition-all group"
                                        >
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-semibold text-white text-xs capitalize truncate group-hover:text-blue-400 transition-colors">
                                                    {interview.topic.replace(/-/g, ' ')}
                                                </h4>
                                                <span className={`w-2 h-2 rounded-full ${interview.overallStatus === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                            </div>
                                            <p className="text-[10px] text-gray-400 mt-1">
                                                {new Date(interview.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </p>
                                        </div>
                                    ))}

                                    {interviews.length > 4 && (
                                        <button 
                                            onClick={() => setIsHistoryModalOpen(true)}
                                            className="w-full text-center py-2 text-xs font-semibold text-blue-400 hover:text-blue-300 hover:underline transition-colors mt-1 cursor-pointer"
                                        >
                                            + View All ({interviews.length})
                                        </button>
                                    )}
                                </>
                            ) : (
                                <p className="text-xs text-gray-500 bg-gray-800/40 rounded-xl p-3">No interviews yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Dashboard Area */}
            <main className="flex-1 flex flex-col min-w-0 transition-all duration-300">
                {/* Header Navbar */}
                <header className="bg-white border-b border-gray-200/80 px-4 sm:px-8 py-4 sticky top-0 z-30 flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={toggleSidebar} 
                            title={sidebarOpen ? "Close sidebar panel" : "Open sidebar panel"}
                            className="p-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-gray-700 transition-colors flex items-center gap-2 cursor-pointer text-xs sm:text-sm font-semibold shadow-2xs"
                        >
                            <FaBars size={16} className="text-gray-700" />
                            <span>{sidebarOpen ? "Hide Panel" : "Show Panel"}</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                {loading ? "Welcome back!" : `Welcome, ${user?.name || "Candidate"}!`}
                            </h2>
                            <p className="text-xs text-gray-500 hidden sm:block">Ready to practice your next technical interview?</p>
                        </div>
                    </div>
                </header>

                {/* Main Section */}
                <section className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8">
                    {/* Stats Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs flex items-center gap-4">
                            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
                                <FaChartLine size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Interviews</p>
                                <p className="text-2xl font-bold text-gray-900 mt-0.5">{interviews.length}</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs flex items-center gap-4">
                            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
                                <FaCheckCircle size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Completed Sessions</p>
                                <p className="text-2xl font-bold text-gray-900 mt-0.5">{completedCount}</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs flex items-center gap-4">
                            <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl">
                                <FaClock size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Scheduled Sessions</p>
                                <p className="text-2xl font-bold text-gray-900 mt-0.5">{upcomingCount}</p>
                            </div>
                        </div>
                    </div>

                    {/* Schedule & Interactive Banner */}
                    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                        <div className="relative z-10 max-w-xl text-center md:text-left">
                            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider">Mock Interview Suite</span>
                            <h2 className="text-2xl sm:text-3xl font-extrabold mt-3 mb-2">Practice Realistic Coding & System Interviews</h2>
                            <p className="text-blue-100 text-sm leading-relaxed">Select a core topic below to generate adaptive AI questions with real-time evaluation and feedback.</p>
                        </div>

                        <div className="relative z-10 w-full md:w-auto">
                            <div className="relative">
                                <button 
                                    onClick={() => setIsCalendarOpen(!isCalendarOpen)} 
                                    className="w-full sm:w-auto bg-white text-gray-900 font-semibold px-6 py-3.5 rounded-2xl shadow-lg hover:bg-gray-100 transition-all flex items-center justify-center gap-3"
                                >
                                    <FaCalendarAlt className="text-blue-600" />
                                    <span>Schedule an Interview</span>
                                    <FaChevronDown className={`transition-transform duration-200 ${isCalendarOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isCalendarOpen && (
                                    <div className="absolute right-0 top-full mt-3 z-30 bg-white shadow-2xl rounded-2xl border p-2 animate-fadeIn text-gray-800">
                                        <Calendar 
                                            onChange={handleDateSelect} 
                                            value={date} 
                                            minDate={new Date()} 
                                            tileContent={tileContent} 
                                            tileClassName={tileClassName} 
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Topics Grid */}
                    <div>
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Select Practice Topic</h3>
                            <p className="text-sm text-gray-500">Instant AI mock interview sessions tailored for CS students and developers.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            <button className="group bg-white p-6 rounded-2xl shadow-xs border border-gray-200/80 hover:shadow-xl hover:border-blue-300 transition-all text-left flex flex-col justify-between" onClick={() => handleStartInterview('data-structures-and-algorithms')}>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-blue-100 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
                                        <FaCode size={22} />
                                    </div>
                                    <h4 className="font-bold text-gray-900 text-base">Data Structures & Algorithms</h4>
                                </div>
                                <p className="text-xs text-gray-500">Arrays, Trees, Graphs, Dynamic Programming & Complexity.</p>
                            </button>

                            <button className="group bg-white p-6 rounded-2xl shadow-xs border border-gray-200/80 hover:shadow-xl hover:border-emerald-300 transition-all text-left flex flex-col justify-between" onClick={() => handleStartInterview('operating-systems')}>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
                                        <FaBriefcase size={22} />
                                    </div>
                                    <h4 className="font-bold text-gray-900 text-base">Operating Systems</h4>
                                </div>
                                <p className="text-xs text-gray-500">Process management, memory allocation, threads & concurrency.</p>
                            </button>

                            <button className="group bg-white p-6 rounded-2xl shadow-xs border border-gray-200/80 hover:shadow-xl hover:border-purple-300 transition-all text-left flex flex-col justify-between" onClick={() => handleStartInterview('computer-networks')}>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-purple-100 text-purple-600 rounded-xl group-hover:scale-110 transition-transform">
                                        <FaGlobe size={22} />
                                    </div>
                                    <h4 className="font-bold text-gray-900 text-base">Computer Networks</h4>
                                </div>
                                <p className="text-xs text-gray-500">OSI layers, TCP/IP, HTTP/HTTPS, DNS & Socket communication.</p>
                            </button>

                            <button className="group bg-white p-6 rounded-2xl shadow-xs border border-gray-200/80 hover:shadow-xl hover:border-amber-300 transition-all text-left flex flex-col justify-between" onClick={() => handleStartInterview('javascript')}>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-amber-100 text-amber-600 rounded-xl group-hover:scale-110 transition-transform">
                                        <FaJs size={22} />
                                    </div>
                                    <h4 className="font-bold text-gray-900 text-base">JavaScript</h4>
                                </div>
                                <p className="text-xs text-gray-500">Event loop, Closures, Promises, Async/Await & ES6+ concepts.</p>
                            </button>

                            <button className="group bg-white p-6 rounded-2xl shadow-xs border border-gray-200/80 hover:shadow-xl hover:border-rose-300 transition-all text-left flex flex-col justify-between" onClick={() => handleStartInterview('java')}>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-rose-100 text-rose-600 rounded-xl group-hover:scale-110 transition-transform">
                                        <FaJava size={22} />
                                    </div>
                                    <h4 className="font-bold text-gray-900 text-base">Java Core</h4>
                                </div>
                                <p className="text-xs text-gray-500">OOP principles, Collections Framework, Multithreading & JVM.</p>
                            </button>

                            <button className="group bg-white p-6 rounded-2xl shadow-xs border border-gray-200/80 hover:shadow-xl hover:border-indigo-300 transition-all text-left flex flex-col justify-between" onClick={() => handleStartInterview('dbms')}>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl group-hover:scale-110 transition-transform">
                                        <FaDatabase size={22} />
                                    </div>
                                    <h4 className="font-bold text-gray-900 text-base">DBMS & SQL</h4>
                                </div>
                                <p className="text-xs text-gray-500">Relational algebra, Indexing, Normalization, ACID & Queries.</p>
                            </button>

                            <button className="group bg-white p-6 rounded-2xl shadow-xs border border-gray-200/80 hover:shadow-xl hover:border-teal-300 transition-all text-left flex flex-col justify-between" onClick={() => handleStartInterview('python')}>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-teal-100 text-teal-600 rounded-xl group-hover:scale-110 transition-transform">
                                        <FaPython size={22} />
                                    </div>
                                    <h4 className="font-bold text-gray-900 text-base">Python Core</h4>
                                </div>
                                <p className="text-xs text-gray-500">Generators, Decorators, GIL, Data structures & memory management.</p>
                            </button>

                            <button className="group bg-white p-6 rounded-2xl shadow-xs border border-gray-200/80 hover:shadow-xl hover:border-sky-300 transition-all text-left flex flex-col justify-between" onClick={() => handleStartInterview('c++')}>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-sky-100 text-sky-600 rounded-xl group-hover:scale-110 transition-transform">
                                        <span className="font-bold text-lg">C++</span>
                                    </div>
                                    <h4 className="font-bold text-gray-900 text-base">C++ & STL</h4>
                                </div>
                                <p className="text-xs text-gray-500">Pointers, Memory management, Templates, Vectors & STL algorithms.</p>
                            </button>
                        </div>
                    </div>

                    {/* History Section on Main Dashboard */}
                    {interviews.length > 0 && (
                        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200/80 shadow-xs">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Recent Interview Reports</h3>
                                    <p className="text-sm text-gray-500">Review your past performance, AI suggestions, and feedback logs.</p>
                                </div>
                                <button 
                                    onClick={() => setIsHistoryModalOpen(true)}
                                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium text-xs transition-colors"
                                >
                                    View All ({interviews.length})
                                </button>
                            </div>

                            <div className="space-y-3">
                                {interviews.slice(0, 5).map((interview) => (
                                    <div 
                                        key={interview._id} 
                                        className="p-4 border border-gray-100 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-all flex items-center justify-between flex-wrap gap-4"
                                    >
                                        <div>
                                            <h4 className="font-bold text-gray-900 capitalize text-sm">{interview.topic.replace(/-/g, ' ')}</h4>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {new Date(interview.createdAt).toLocaleString('en-US', {
                                                    year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${interview.overallStatus === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {interview.overallStatus === 'completed' ? 'Completed' : 'In Progress'}
                                            </span>
                                            <button 
                                                onClick={() => navigate(`/feedback/${interview._id}`)}
                                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-medium transition-colors shadow-xs"
                                            >
                                                {interview.overallStatus === 'completed' ? 'View Feedback' : 'Resume'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </section>
            </main>

            {/* Logout Confirmation Modal */}
            <Logout isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} onConfirm={handleConfirmLogout} />

            {/* Schedule Interview Modal */}
            <ScheduleFormModal 
                isOpen={isFormOpen} 
                isScheduling={isScheduling}
                selectedDate={date} 
                onClose={() => setIsFormOpen(false)} 
                onSchedule={handleScheduleConfirm} 
            />

            {/* History Modal */}
            <HistoryModal 
                isOpen={isHistoryModalOpen} 
                onClose={() => setIsHistoryModalOpen(false)} 
                interviews={interviews} 
                onSelectInterview={(i) => navigate(`/feedback/${i._id}`)} 
            />
        </div>
    );
}

export default Dashboard;