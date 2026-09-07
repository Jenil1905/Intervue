import React from 'react';
import { FaUserCircle, FaEdit, FaEnvelope, FaPhone, FaUser, FaArrowLeft, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { getUserProfile, updateUserPhone, updateUsername, updateProfilePicture } from '../../apiCalls/userCall';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// This is your modal for editing NAME and PHONE
function EditProfileModal({ isOpen, onClose, formData, setFormData, onSave, isSaving }) {
    if (!isOpen) return null;
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave();
    };
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-md text-gray-800 shadow-2xl animate-fadeIn">
                <h2 className="text-2xl font-bold mb-4 text-gray-900">Edit Profile</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2 font-medium text-sm">Full Name</label>
                        <input 
                            type="text" 
                            name="name" 
                            disabled={isSaving}
                            value={formData.name} 
                            onChange={handleChange} 
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100" 
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2 font-medium text-sm">Phone Number</label>
                        <input 
                            type="tel" 
                            name="phone_number" 
                            disabled={isSaving}
                            placeholder="+1 (555) 000-0000"
                            value={formData.phone_number} 
                            onChange={handleChange} 
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100" 
                        />
                    </div>
                    <div className="flex justify-end gap-3">
                        <button 
                            type="button" 
                            disabled={isSaving}
                            onClick={onClose} 
                            className="px-6 py-2.5 rounded-xl border border-gray-300 font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={isSaving}
                            className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            {isSaving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <span>Save Changes</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
    const [toast, setToast] = useState(null); // { type: 'success' | 'error', message: string }
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', phone_number: '' });
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 4000);
    };

    useEffect(() => {
        async function fetchUserProfile() {
            try {
                const response = await getUserProfile();
                setUser(response.data.user);
                setFormData({
                    name: response.data.user.name || '',
                    phone_number: response.data.user.phone_number || ''
                });
            } catch (error) {
                console.error('Error fetching user profile:', error);
                showToast('error', 'Failed to load profile details.');
            } finally {
                setLoading(false);
            }
        }
        fetchUserProfile();
    }, []);

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            if (formData.name !== user.name) {
                await updateUsername(formData.name);
            }
            if (formData.phone_number !== user.phone_number) {
                await updateUserPhone(formData.phone_number);
            }
            const response = await getUserProfile();
            setUser(response.data.user);
            setIsModalOpen(false);
            showToast('success', 'Profile updated successfully!');
        } catch (error) {
            console.error("Failed to update profile", error);
            showToast('error', error.response?.data?.message || 'Failed to update profile.');
        } finally {
            setIsSaving(false);
        }
    };

    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadFormData = new FormData();
        uploadFormData.append('profilePic', file);
        setIsUploadingPhoto(true);

        try {
            const response = await updateProfilePicture(uploadFormData);
            setUser(response.data.user);
            showToast('success', 'Profile photo updated!');
        } catch (error) {
            console.error("Failed to upload photo:", error);
            showToast('error', 'Failed to upload profile picture.');
        } finally {
            setIsUploadingPhoto(false);
        }
    };

    const getInitial = (name) => name ? name.charAt(0).toUpperCase() : 'U';

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            {/* Toast Banner */}
            {toast && (
                <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl border text-sm font-medium animate-bounce ${toast.type === 'success' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-rose-50 border-rose-300 text-rose-800'}`}>
                    {toast.type === 'success' ? <FaCheckCircle className="text-emerald-500 text-lg" /> : <FaExclamationCircle className="text-rose-500 text-lg" />}
                    <span>{toast.message}</span>
                </div>
            )}

            <div className="max-w-4xl mx-auto">
                {/* Back to Dashboard Navigation */}
                <div className="mb-6">
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition-colors bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm"
                    >
                        <FaArrowLeft size={14} /> Back to Dashboard
                    </button>
                </div>

                {/* Profile Card Header */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 h-36 relative"></div>
                    <div className="relative px-6 pb-6">
                        <div className="absolute -top-16 left-6 group">
                            {user?.profile_picture ? (
                                <img src={user.profile_picture} alt="Profile" className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover" />
                            ) : (
                                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                    <span className="text-4xl font-bold text-white">{getInitial(user?.name)}</span>
                                </div>
                            )}

                            {isUploadingPhoto && (
                                <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}
                        </div>
                        <div className="pt-20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{user?.name || 'User Name'}</h1>
                                <p className="text-gray-500 text-sm mt-1">{user?.email || 'No email provided'}</p>
                            </div>
                            <button 
                                onClick={() => setIsModalOpen(true)} 
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
                            >
                                <FaEdit className="w-4 h-4" />
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>

                {/* Information Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                <FaUser className="text-blue-600" /> Personal Details
                            </h2>
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                                    <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3"><p className="text-gray-900 font-medium">{user?.name || 'Not provided'}</p></div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                                    <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3"><FaEnvelope className="text-blue-500" /><p className="text-gray-900 font-medium">{user?.email || 'Not provided'}</p></div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
                                    <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3"><FaPhone className="text-blue-500" /><p className="text-gray-900 font-medium">{user?.phone_number || 'Not provided'}</p></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <button 
                                    onClick={() => setIsModalOpen(true)} 
                                    className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 hover:bg-blue-50/50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <FaEdit className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <span className="text-gray-700 font-medium text-sm">Edit Profile</span>
                                    </div>
                                </button>
                                
                                <button 
                                    onClick={() => fileInputRef.current.click()} 
                                    disabled={isUploadingPhoto}
                                    className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 hover:bg-blue-50/50 transition-colors disabled:opacity-50"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <FaUserCircle className="w-4 h-4 text-purple-600" />
                                        </div>
                                        <span className="text-gray-700 font-medium text-sm">
                                            {isUploadingPhoto ? 'Uploading Photo...' : 'Change Photo'}
                                        </span>
                                    </div>
                                </button>
                            </div>

                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handlePhotoChange}
                                className="hidden"
                                accept="image/png, image/jpeg, image/jpg"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <EditProfileModal
                isOpen={isModalOpen}
                isSaving={isSaving}
                onClose={() => setIsModalOpen(false)}
                formData={formData}
                setFormData={setFormData}
                onSave={handleSaveProfile}
            />
        </div>
    );
}

export default Profile;