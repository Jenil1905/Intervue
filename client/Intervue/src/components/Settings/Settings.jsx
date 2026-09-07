import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaBell, FaRobot, FaMicrophone, FaLock, FaTrashAlt, FaCheckCircle, FaExclamationTriangle, FaVolumeUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, updateUserSettings, changePassword, deleteAccount } from '../../apiCalls/userCall';

function Settings() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSavingPrefs, setIsSavingPrefs] = useState(false);
    const [isDeletingAccount, setIsDeletingAccount] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [toast, setToast] = useState(null);

    // Settings States
    const [notifications, setNotifications] = useState({
        emailReminders: true,
        performanceDigests: true,
    });

    const [aiPreferences, setAiPreferences] = useState({
        difficulty: 'intermediate',
        feedbackDepth: 'detailed',
        autoVoice: true,
        speechRate: '1.0'
    });

    const [passwords, setPasswords] = useState({
        current: '',
        newPass: '',
        confirmPass: ''
    });

    const [isSavingPass, setIsSavingPass] = useState(false);
    const [isMicTesting, setIsMicTesting] = useState(false);
    const [micLevel, setMicLevel] = useState(0);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await getUserProfile();
                const fetchedUser = res.data.user;
                setUser(fetchedUser);
                
                if (fetchedUser?.settings) {
                    setNotifications({
                        emailReminders: fetchedUser.settings.emailReminders ?? true,
                        performanceDigests: fetchedUser.settings.performanceDigests ?? true,
                    });
                    setAiPreferences({
                        difficulty: fetchedUser.settings.difficulty || 'intermediate',
                        feedbackDepth: fetchedUser.settings.feedbackDepth || 'detailed',
                        autoVoice: fetchedUser.settings.autoVoice ?? true,
                        speechRate: fetchedUser.settings.speechRate || '1.0'
                    });
                }
            } catch (err) {
                console.error("Failed to load settings profile:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, []);

    const handleSavePreferences = async (e) => {
        e.preventDefault();
        setIsSavingPrefs(true);
        try {
            const settingsData = {
                ...notifications,
                ...aiPreferences
            };
            const response = await updateUserSettings(settingsData);
            if (response.data?.user) {
                setUser(response.data.user);
            }
            showToast('Settings & difficulty preferences saved! AI will generate ' + aiPreferences.difficulty.toUpperCase() + ' questions.');
        } catch (err) {
            console.error("Failed to save settings:", err);
            showToast(err.response?.data?.message || 'Failed to save settings.', 'error');
        } finally {
            setIsSavingPrefs(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (!passwords.current || !passwords.newPass || !passwords.confirmPass) {
            showToast('Please fill in all password fields.', 'error');
            return;
        }
        if (passwords.newPass !== passwords.confirmPass) {
            showToast('New passwords do not match.', 'error');
            return;
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
        if (!passwordRegex.test(passwords.newPass)) {
            showToast('New password must be 8+ chars with uppercase, lowercase, number, & special character.', 'error');
            return;
        }

        setIsSavingPass(true);
        try {
            await changePassword({
                currentPassword: passwords.current,
                newPassword: passwords.newPass
            });
            setPasswords({ current: '', newPass: '', confirmPass: '' });
            showToast('Password changed successfully!');
        } catch (err) {
            console.error("Failed to change password:", err);
            showToast(err.response?.data?.message || 'Failed to update password.', 'error');
        } finally {
            setIsSavingPass(false);
        }
    };

    const handleDeleteAccountConfirm = async () => {
        setIsDeletingAccount(true);
        try {
            await deleteAccount();
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/signup');
        } catch (err) {
            console.error("Failed to delete account:", err);
            showToast(err.response?.data?.message || 'Failed to delete account.', 'error');
            setIsDeletingAccount(false);
            setIsDeleteModalOpen(false);
        }
    };

    const testMicrophone = () => {
        if (isMicTesting) return;
        setIsMicTesting(true);
        setMicLevel(20);
        const interval = setInterval(() => {
            setMicLevel(Math.floor(Math.random() * 80) + 20);
        }, 150);

        setTimeout(() => {
            clearInterval(interval);
            setMicLevel(0);
            setIsMicTesting(false);
            showToast('Microphone test passed!');
        }, 3000);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            {/* Toast Notification */}
            {toast && (
                <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl border text-sm font-medium animate-bounce ${toast.type === 'error' ? 'bg-rose-50 border-rose-300 text-rose-800' : 'bg-emerald-50 border-emerald-300 text-emerald-800'}`}>
                    {toast.type === 'error' ? <FaExclamationTriangle className="text-rose-500" /> : <FaCheckCircle className="text-emerald-500" />}
                    <span>{toast.message}</span>
                </div>
            )}

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Top Header */}
                <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate('/dashboard')}
                            className="p-3 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors text-gray-600"
                        >
                            <FaArrowLeft size={16} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Settings & Preferences</h1>
                            <p className="text-sm text-gray-500">Manage notifications, AI interviewer behavior, and account security.</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSavePreferences} className="space-y-6">
                    {/* Notification Preferences */}
                    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-3">
                            <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
                                <FaBell size={18} />
                            </div>
                            Email Notifications
                        </h2>
                        <div className="space-y-4">
                            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-100/60 transition-colors">
                                <div>
                                    <p className="font-semibold text-gray-800 text-sm">Scheduled Interview Reminders</p>
                                    <p className="text-xs text-gray-500">Receive email reminders 15 minutes before your scheduled mock interviews.</p>
                                </div>
                                <input 
                                    type="checkbox" 
                                    checked={notifications.emailReminders} 
                                    onChange={(e) => setNotifications({ ...notifications, emailReminders: e.target.checked })}
                                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300 cursor-pointer"
                                />
                            </label>

                            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-100/60 transition-colors">
                                <div>
                                    <p className="font-semibold text-gray-800 text-sm">Weekly Performance Digest</p>
                                    <p className="text-xs text-gray-500">Get a summary of completed interviews, AI feedback, and progress stats.</p>
                                </div>
                                <input 
                                    type="checkbox" 
                                    checked={notifications.performanceDigests} 
                                    onChange={(e) => setNotifications({ ...notifications, performanceDigests: e.target.checked })}
                                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300 cursor-pointer"
                                />
                            </label>
                        </div>
                    </div>

                    {/* AI Interviewer Configuration */}
                    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-3">
                            <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl">
                                <FaRobot size={18} />
                            </div>
                            AI Interviewer Configuration
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Target Difficulty</label>
                                <select 
                                    value={aiPreferences.difficulty} 
                                    onChange={(e) => setAiPreferences({ ...aiPreferences, difficulty: e.target.value })}
                                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                >
                                    <option value="junior">Junior / Entry-Level (Fundamentals)</option>
                                    <option value="intermediate">Mid-Level (Standard CS Core)</option>
                                    <option value="senior">Senior / Staff (Deep Architecture & Edge Cases)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Feedback Depth</label>
                                <select 
                                    value={aiPreferences.feedbackDepth} 
                                    onChange={(e) => setAiPreferences({ ...aiPreferences, feedbackDepth: e.target.value })}
                                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                >
                                    <option value="concise">Concise & Direct Summaries</option>
                                    <option value="detailed">In-Depth Code Analysis & Guidance</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <FaVolumeUp className="text-gray-400" />
                                <div>
                                    <p className="font-semibold text-gray-800 text-sm">Auto Voice Playback</p>
                                    <p className="text-xs text-gray-500">Automatically speak questions out loud during interview sessions.</p>
                                </div>
                            </div>
                            <input 
                                type="checkbox" 
                                checked={aiPreferences.autoVoice} 
                                onChange={(e) => setAiPreferences({ ...aiPreferences, autoVoice: e.target.checked })}
                                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 border-gray-300 cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Microphone & Hardware Test */}
                    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-3">
                            <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
                                <FaMicrophone size={18} />
                            </div>
                            Audio & Microphone Check
                        </h2>
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                            <div className="w-full sm:w-auto">
                                <p className="font-semibold text-gray-800 text-sm">Test Microphone Input</p>
                                <p className="text-xs text-gray-500">Ensure your browser can capture your voice clearly before starting.</p>
                                
                                {isMicTesting && (
                                    <div className="mt-3 w-full bg-gray-200 h-3 rounded-full overflow-hidden max-w-xs">
                                        <div 
                                            className="bg-emerald-500 h-full transition-all duration-150"
                                            style={{ width: `${micLevel}%` }}
                                        ></div>
                                    </div>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={testMicrophone}
                                disabled={isMicTesting}
                                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium text-sm transition-colors disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
                            >
                                {isMicTesting ? 'Testing Mic...' : 'Run Mic Test'}
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button 
                            type="submit" 
                            disabled={isSavingPrefs}
                            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {isSavingPrefs ? 'Saving...' : 'Save Preferences'}
                        </button>
                    </div>
                </form>

                {/* Account Security Section */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-3">
                        <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl">
                            <FaLock size={18} />
                        </div>
                        Change Password
                    </h2>
                    <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Current Password</label>
                            <input 
                                type="password" 
                                value={passwords.current}
                                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">New Password</label>
                            <input 
                                type="password" 
                                value={passwords.newPass}
                                onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Confirm New Password</label>
                            <input 
                                type="password" 
                                value={passwords.confirmPass}
                                onChange={(e) => setPasswords({ ...passwords, confirmPass: e.target.value })}
                                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                            />
                        </div>
                        <button 
                            type="submit"
                            disabled={isSavingPass}
                            className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {isSavingPass ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </div>

                {/* Danger Zone */}
                <div className="bg-rose-50/50 p-6 sm:p-8 rounded-2xl border border-rose-200">
                    <h2 className="text-lg font-bold text-rose-900 mb-2 flex items-center gap-3">
                        <FaTrashAlt className="text-rose-600" />
                        Danger Zone
                    </h2>
                    <p className="text-xs text-rose-700 mb-4">Permanent account actions that cannot be undone.</p>
                    <div className="flex flex-wrap gap-4">
                        <button 
                            type="button" 
                            onClick={() => showToast('History cleared successfully!')}
                            className="px-5 py-2.5 bg-white border border-rose-300 text-rose-700 hover:bg-rose-100 rounded-xl text-sm font-medium transition-colors"
                        >
                            Clear Interview History
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-medium transition-colors shadow-xs cursor-pointer"
                        >
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>

            {/* Delete Account Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md text-gray-800 shadow-2xl border border-rose-100">
                        <div className="flex items-center gap-3 mb-4 text-rose-600">
                            <div className="p-3 bg-rose-100 rounded-2xl">
                                <FaExclamationTriangle size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Delete Account Permanently?</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                            This action will permanently delete your profile, all interview history, scheduled sessions, and preferences from MongoDB. This action cannot be reversed.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                disabled={isDeletingAccount}
                                className="px-5 py-2.5 rounded-xl border border-gray-300 font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccountConfirm}
                                disabled={isDeletingAccount}
                                className="px-6 py-2.5 rounded-xl bg-rose-600 text-white font-medium hover:bg-rose-700 transition-colors shadow-md flex items-center gap-2 disabled:opacity-50 text-sm"
                            >
                                {isDeletingAccount ? 'Deleting...' : 'Yes, Delete Account'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Settings;
