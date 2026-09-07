const User = require('../models/user.model');


// get user data
const getCurrentUser = async (req, res) => {
    try{
        const user = await User.findById(req.userId).select('-password');
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }
        return res.status(200).json({user});
    }catch(err){
        return res.status(500).json({message: err.message});
    }
}

//update userName
const updateUsername = async (req,res)=>{
    try{
        const {name} = req.body
        if(!name){
            return res.status(400).json({message:"Name is required"});
        }
        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            { name },
            { new: true }
        ).select('-password');
        return res.status(200).json({message:"User updated successfully", user:updatedUser});
    } catch (error) {
        console.error("Error updating username:", error);
        return res.status(500).json({ message: 'Server error' });
    }
}

//update phone number

 const updateUserPhone = async (req, res) => {
    try {
        const { phone_number } = req.body;
        // You can add validation for the phone number here
        
        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            { phone_number },
            { new: true }
        );
        res.status(200).json({ message: 'Phone number updated', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

//upload profile pic
 const updateUserProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        // Get the secure URL from the Cloudinary response
        const profilePicUrl = req.file.path;

        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            { profile_picture: profilePicUrl },
            { new: true }
        );

        res.status(200).json({ message: 'Profile picture updated', user: updatedUser });
    } catch (error) {
        console.error("Error updating profile picture:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

// update user settings
const updateUserSettings = async (req, res) => {
    try {
        const { settings } = req.body;
        if (!settings) {
            return res.status(400).json({ message: "Settings object is required" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            { $set: { settings } },
            { new: true }
        ).select('-password');

        return res.status(200).json({ message: "Settings updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error updating settings:", error);
        return res.status(500).json({ message: 'Server error updating settings' });
    }
};

// change password
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Both current and new passwords are required" });
        }
        
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({ 
                message: "New password must be at least 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character." 
            });
        }

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const bcrypt = require('bcrypt');
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect current password" });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error changing password:", error);
        return res.status(500).json({ message: 'Server error changing password' });
    }
};

// delete account
const deleteAccount = async (req, res) => {
    try {
        const userId = req.userId;
        const Interview = require('../models/interview.model');
        
        if (Interview) {
            await Interview.deleteMany({ userId });
        }
        
        await User.findByIdAndDelete(userId);
        res.clearCookie('token');
        return res.status(200).json({ success: true, message: "Account deleted successfully" });
    } catch (error) {
        console.error("Error deleting account:", error);
        return res.status(500).json({ message: "Server error deleting account" });
    }
};

module.exports = {
    getCurrentUser, 
    updateUserPhone, 
    updateUsername, 
    updateUserProfilePicture,
    updateUserSettings,
    changePassword,
    deleteAccount
};