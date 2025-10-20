import React from 'react';
import { FaUserCircle, FaEdit, FaEnvelope, FaPhone, FaUser } from 'react-icons/fa';
import { getUserProfile, updateUserPhone, updateUsername, updateProfilePicture } from '../../apiCalls/userCall';
import { useState, useEffect, useRef } from 'react';

// This is your modal for editing NAME and PHONE
function EditProfileModal({ isOpen, onClose, formData, setFormData, onSave }) {
    if (!isOpen) return null;
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave();
    };
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md text-gray-800">
                <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2 font-medium">Full Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2 font-medium">Phone Number</label>
                        <input type="tel" name="phone_number" value={formData.phone_number} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
                    </div>
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg border hover:bg-gray-100">Cancel</button>
                        <button type="submit" className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', phone_number: '' });
    const fileInputRef = useRef(null); // ✅ Ref for the file input

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
            } finally {
                setLoading(false);
            }
        }
        fetchUserProfile();
    }, []);

    const handleSaveProfile = async () => {
        try {
            if (formData.name !== user.name) await updateUsername(formData.name);
            if (formData.phone_number !== user.phone_number) await updateUserPhone(formData.phone_number);
            const response = await getUserProfile();
            setUser(response.data.user);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to update profile", error);
        }
    };

    // ✅ This function handles the file upload
    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadFormData = new FormData();
        uploadFormData.append('profilePic', file);

        try {
            const response = await updateProfilePicture(uploadFormData);
            setUser(response.data.user);
        } catch (error) {
            console.error("Failed to upload photo:", error);
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
            <div className="max-w-4xl mx-auto">
                {/* Header and Profile Details sections are correct */}
                {/* ... */}
                 <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-lg h-32"></div>
                    <div className="relative px-6 pb-6">
                        <div className="absolute -top-16 left-6">
                            {user?.profile_picture ? (
                                <img src={user.profile_picture} alt="Profile" className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover" />
                            ) : (
                                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-blue-100 flex items-center justify-center">
                                    <span className="text-4xl font-bold text-blue-600">{getInitial(user?.name)}</span>
                                </div>
                            )}
                        </div>
                        <div className="pt-20 flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{user?.name || 'User Name'}</h1>
                                <p className="text-gray-600 text-lg">{user?.email || 'No email provided'}</p>
                            </div>
                            <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors">
                                <FaEdit className="w-4 h-4" />
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick Actions Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        {/* ... Personal Information ... */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                <FaUser className="text-blue-600" /> Personal Information
                            </h2>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                    <div className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"><p className="text-gray-900">{user?.name || 'Not provided'}</p></div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                    <div className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 flex items-center gap-3"><FaEnvelope className="text-blue-600" /><p className="text-gray-900">{user?.email || 'Not provided'}</p></div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                    <div className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 flex items-center gap-3"><FaPhone className="text-blue-600" /><p className="text-gray-900">{user?.phone_number || 'Not provided'}</p></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <button onClick={() => setIsModalOpen(true)} className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-blue-50">
                                    <div className="flex items-center gap-3"><div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"><FaEdit className="w-4 h-4 text-blue-600" /></div><span className="text-gray-700">Edit Profile</span></div>
                                </button>
                                
                                {/* ✅ This button triggers the file input */}
                                <button onClick={() => fileInputRef.current.click()} className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-blue-50">
                                    <div className="flex items-center gap-3"><div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"><FaUserCircle className="w-4 h-4 text-blue-600" /></div><span className="text-gray-700">Change Photo</span></div>
                                </button>
                            </div>

                            {/* ✅ This hidden input is what opens the file dialog */}
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
                onClose={() => setIsModalOpen(false)}
                formData={formData}
                setFormData={setFormData}
                onSave={handleSaveProfile}
            />
        </div>
    );
}

export default Profile;