const express = require('express')
const router = express.Router()
const isAuth = require('./../middlewares/isAuth.js')

router.get('/verify', isAuth , (req,res)=>{
    res.status(200).json({message:'Token is valid'})
})

module.exports = router