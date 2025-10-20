import React, { useEffect, useState } from 'react';
import { FaUserCircle, FaUserCog, FaBars, FaTimes, FaHistory, FaCode, FaBriefcase, FaJs, FaGlobe, FaChevronRight, FaJava, FaPython, FaDatabase, FaCalendarAlt, FaChevronDown } from 'react-icons/fa';
import { FaArrowRightFromBracket } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import SplitText from '../../../Reactbits/SplitText/SplitText.jsx';
import { getUserProfile } from '../../apiCalls/userCall.js';
import { getInterviewHistory } from '../../apiCalls/interviewCall.js';
import { logout } from '../../apiCalls/authCalls.js';
import { getScheduledInterviews, scheduleInterview } from '../../apiCalls/scheduleInterviewCalls.js'; 
import Logout from '../LogoutMenu/Logout.jsx';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function ScheduleFormModal({ isOpen, selectedDate, onClose, onSchedule }) {
    if (!isOpen) return null;

    const [topic, setTopic] = useState('data-structures-and-algorithms');
    const [time, setTime] = useState('09:00');

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md text-gray-800">
                <h2 className="text-2xl font-bold mb-4">Schedule Interview</h2>
                <p className="mb-4">You have selected: <span className="font-semibold">{selectedDate.toDateString()}</span></p>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                        <select value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full p-2 border rounded-md">
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                        <select value={time} onChange={(e) => setTime(e.target.value)} className="w-full p-2 border rounded-md">
                            <option value="09:00">9:00 AM</option>
                            <option value="11:00">11:00 AM</option>
                            <option value="14:00">2:00 PM</option>
                            <option value="16:00">4:00 PM</option>
                            <option value="18:00">6:00 PM</option>
                               </select>
                    </div>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                    <button onClick={onClose} className="px-6 py-2 rounded-lg border hover:bg-gray-100">Cancel</button>
                    <button onClick={() => onSchedule(topic, time)} className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Confirm Schedule</button>
                </div>
            </div>
        </div>
    );
}

function Dashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const navigate = useNavigate();
    const [date, setDate] = useState(new Date());
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [scheduledInterviews, setScheduledInterviews] = useState([]);

     const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            const interviewDates = new Set(
                scheduledInterviews.map(interview => new Date(interview.scheduledTime).toDateString())
            );

            // If a date has an interview, add a 'group' class to it for the tooltip
            if (interviewDates.has(date.toDateString())) {
                return 'relative group';
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
                    {/* The visible dot */}
                    <div className="h-2 w-2 bg-blue-500 rounded-full mx-auto mt-1 group-hover:bg-white"></div>
                    
                    {/* The hidden tooltip that appears on hover */}
                    <div className="
                        absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 p-2 
                        bg-gray-800 text-white text-xs rounded-lg shadow-lg 
                        opacity-0 group-hover:opacity-100 transition-opacity 
                        pointer-events-none 
                        z-10 
                    ">
                        <p className="font-bold capitalize">{interviewForThisDay.topic.replace(/-/g, ' ')}</p>
                        <p className="mt-1">{new Date(interviewForThisDay.scheduledTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                        {/* Tooltip arrow */}
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-800 -mb-1"></div>
                    </div>
                </>
            );
        }
    }
    return null;
};

//fetch the data
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
                setInterviews(historyRes.data.interviews);
                setScheduledInterviews(scheduleRes.data.interviews)
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

    const startInterview = (topic) => {
        navigate(`/interview/${topic}`);
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
        try {
            await scheduleInterview(topic, scheduledDateTime);
            window.alert("Interview Scheduled")
            setIsFormOpen(false);
        } catch (error) {
            console.error("Failed to schedule interview:", error);
        }
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {sidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={toggleSidebar}></div>}

            <aside className={`

                ${sidebarOpen ? 'lg:w-72' : 'lg:w-0'}                fixed inset-y-0 left-0 z-50 w-72 h-screen

                lg:relative lg:translate-x-0 lg:z-auto

                bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-2xl

                transition-transform duration-300 ease-in-out

                flex flex-col

                overflow-hidden

            `}>
                <div className="flex-shrink-0 p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-6 sm:mb-8">
                        <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2 sm:gap-3"><FaCode className="text-blue-400" /><span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Intervue</span></h1>
                        <button onClick={toggleSidebar} className="p-2 hover:bg-gray-700 rounded-lg lg:hidden"><FaTimes size={16} /></button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto px-4 sm:px-6">
                    {loading ? (<div className="bg-gray-700/30 rounded-xl p-4 mb-6 animate-pulse"><div className="flex items-center space-x-3"><div className="w-10 h-10 bg-gray-600 rounded-full"></div><div className="w-2/3 h-4 bg-gray-600 rounded"></div></div></div>) :
                        (<div className="bg-gray-700/30 rounded-xl p-4 mb-6"><div className="flex items-center space-x-3">{user?.profile_picture ? (<img src={user.profile_picture} alt="Profile" className="w-10 h-10 rounded-full object-cover" />) : (<div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center"><span className="text-sm font-semibold">{user?.name?.charAt(0).toUpperCase() || 'U'}</span></div>)}<div><p className="font-medium text-sm">{user?.name || "User"}</p></div></div></div>)}
                    <nav className="space-y-1 mb-6 sm:mb-8">
                        <a href="/profile" className="flex items-center justify-between p-3 hover:bg-gray-700/50 rounded-lg"><div className="flex items-center"><FaUserCircle className="mr-3 text-blue-400" size={18} /><span>Profile</span></div><FaChevronRight size={12} /></a>
                        <a href="/settings" className="flex items-center justify-between p-3 hover:bg-gray-700/50 rounded-lg"><div className="flex items-center"><FaUserCog className="mr-3 text-green-400" size={18} /><span>Settings</span></div><FaChevronRight size={12} /></a>
                        <button onClick={() => setIsLogoutModalOpen(true)} className="w-full flex items-center justify-between p-3 hover:bg-gray-700/50 rounded-lg"><div className="flex items-center"><FaArrowRightFromBracket className="mr-3 text-red-400" size={18} /><span>Logout</span></div><FaChevronRight size={12} /></button>
                    </nav>
                    <div className="border-t border-gray-600/30 pt-4 sm:pt-6">
                        <h2 className="text-sm sm:text-base font-semibold flex items-center text-gray-300"><FaHistory className="mr-2 text-purple-400" size={16} />Previous Interviews</h2>
                        <div className="mt-3 space-y-2 cursor-pointer">
                            {loading ? (<div className="text-xs text-gray-500 bg-gray-700/20 rounded-lg p-3 animate-pulse">Loading history...</div>) : interviews.length > 0 ? (interviews.map(interview => (<div key={interview._id} className="bg-gray-700/30 rounded-lg p-3"><h4 className="font-bold text-white text-sm capitalize">{interview.topic.replace(/-/g, ' ')}</h4><p className="text-xs text-gray-400 mt-1">{new Date(interview.createdAt).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}</p></div>))) : (<div className="text-xs text-gray-500 bg-gray-700/20 rounded-lg p-3">No interviews yet.</div>)}
                        </div>
                    </div>
                </div>
            </aside>

            <main className="flex-1 flex flex-col min-w-0">
                <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50 px-4 sm:px-6 py-4 sticky top-0 z-30">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4"><button onClick={toggleSidebar} className="p-2 hover:bg-gray-100 rounded-lg"><FaBars size={20} className="text-gray-600" /></button></div>
                        <div className="text-right text-blue-600"><SplitText key={user ? user._id : "guest"} text={loading ? "Welcome!" : `Welcome ${user ? user.name : "User"}!`} className="text-2xl sm:text-3xl lg:text-4xl font-bold" /></div>
                    </div>
                </header>

                <section className="flex-1 flex flex-col items-center p-4 sm:p-6 lg:p-8">
                    <div className="w-full max-w-sm mb-8 text-center">
                        <div className="relative">
                            <button onClick={() => setIsCalendarOpen(!isCalendarOpen)} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 flex items-center justify-between text-gray-700 hover:border-blue-500 transition-colors">
                                <div className="flex items-center gap-3">
                                    <FaCalendarAlt className="text-blue-600" />
                                    <span className="font-medium">Schedule an Interview</span>
                                </div>
                                <FaChevronDown className={`transition-transform duration-200 ${isCalendarOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isCalendarOpen && (
                                <div className="absolute top-full w-full mt-2 z-20 bg-white shadow-lg rounded-lg border">
                                    <Calendar onChange={handleDateSelect} value={date} minDate={new Date()} tileContent={tileContent} tileClassName={tileClassName} 
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="text-center mb-8 sm:mb-12 max-w-4xl">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">Or, Start an Interview Now</h2>
                        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">Choose from various technical topics to start your practice interview session immediately.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl w-full">
                        <button className="group bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-blue-200" onClick={() => startInterview('data-structures-and-algorithms')}><div className="flex items-center space-x-3"><div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl"><FaCode className="text-blue-600" size={20} /></div><div className="flex-1 text-left"><h3 className="font-semibold text-gray-800">Data Structures & Algorithms</h3></div></div></button>
                        <button className="group bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-green-200" onClick={() => startInterview('operating-systems')}><div className="flex items-center space-x-3"><div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-xl"><FaBriefcase className="text-green-600" size={20} /></div><div className="flex-1 text-left"><h3 className="font-semibold text-gray-800">Operating System</h3></div></div></button>
                        <button className="group bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-purple-200" onClick={() => startInterview('computer-networks')}><div className="flex items-center space-x-3"><div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl"><FaGlobe className="text-purple-600" size={20} /></div><div className="flex-1 text-left"><h3 className="font-semibold text-gray-800">Computer Networks</h3></div></div></button>
                        <button className="group bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-yellow-300" onClick={() => startInterview('javascript')}><div className="flex items-center space-x-3"><div className="p-3 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl"><FaJs className="text-yellow-500" size={20} /></div><div className="flex-1 text-left"><h3 className="font-semibold text-gray-800">JavaScript</h3></div></div></button>
                        <button className="group bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-red-200" onClick={() => startInterview('java')}><div className="flex items-center space-x-3"><div className="p-3 bg-gradient-to-br from-red-100 to-red-200 rounded-xl"><FaJava className="text-red-600" size={20} /></div><div className="flex-1 text-left"><h3 className="font-semibold text-gray-800">Java</h3></div></div></button>
                        <button className="group bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-indigo-200" onClick={() => startInterview('dbms')}><div className="flex items-center space-x-3"><div className="p-3 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-xl"><FaDatabase className="text-indigo-600" size={20} /></div><div className="flex-1 text-left"><h3 className="font-semibold text-gray-800">DBMS</h3></div></div></button>
                        <button className="group bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-teal-200" onClick={() => startInterview('python')}><div className="flex items-center space-x-3"><div className="p-3 bg-gradient-to-br from-teal-100 to-teal-200 rounded-xl"><FaPython className="text-teal-600" size={20} /></div><div className="flex-1 text-left"><h3 className="font-semibold text-gray-800">Python</h3></div></div></button>
                        <button className="group bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-sky-200" onClick={() => startInterview('c++')}><div className="flex items-center space-x-3"><div className="p-3 bg-gradient-to-br from-sky-100 to-sky-200 rounded-xl"><span className="font-bold text-sky-600">C++</span></div><div className="flex-1 text-left"><h3 className="font-semibold text-gray-800">C++</h3></div></div></button>
                    </div>
                </section>
            </main>

            <Logout isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} onConfirm={handleConfirmLogout} />
            <ScheduleFormModal isOpen={isFormOpen} selectedDate={date} onClose={() => setIsFormOpen(false)} onSchedule={handleScheduleConfirm} />
        </div>
    );
}

export default Dashboard;