const express = require('express');
const isAuth = require('../middlewares/isAuth.js');
const {getCurrentUser,updateUserPhone,updateUsername, updateUserProfilePicture} = require('../controllers/user.controller.js')
const multer = require('multer')
const storage = require('./../cloudinary.js')

const router = express.Router();


router.get('/current', isAuth, getCurrentUser);
router.patch('/update-phone', isAuth,updateUserPhone)
router.patch('/update-name', isAuth, updateUsername)
//upload the photo
const upload = multer({storage:storage})
router.post('/profile-picture', isAuth, upload.single('profilePic'),updateUserProfilePicture)

module.exports = router;