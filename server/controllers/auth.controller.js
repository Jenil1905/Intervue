const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const generateToken = require('../token');


//Signup controller

async function signup(req, res) {
    const { name, email, password } = req.body;

    try{
        //Validate the input
        if(!name || !email || !password){
            return res.status(400).json({message: 'All fields are required'});
        }

     //Check if user already exists
     const existingUser = await User.findOne({email});
     if(existingUser){
        return res.status(400).json({message: 'User already exists'});
     }
      
      //validate password length
      if(password.length < 6){
        return res.status(400).json({message: 'Password must be at least 6 characters long'});
      }
    
     //Hash the password
     const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

    //Create a new user
    const newUser = await User.create({name , email , password:hashedPassword})

    //store token in cookie
    const token = await generateToken(newUser._id);
    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 30*24*60*60*1000 //30 days
    })

    return res.status(201).json({message:'User created successfully'})
     
    }catch(err){
        return res.status(500).json({message: err.message});
    }
}


//Login controller
async function login(req,res){
    const{email,password} = req.body;

    try{
        //Validate the input
        if(!email || !password){
            return res.status(400).json({message: 'All fields are required'});
        }

        //validate password length
        if(password.length < 6){
            return res.status(400).json({message: 'Password must be at least 6 characters long'});
        }

        //Check if user exists
        const existingUser = await User.findOne({email});
        if(!existingUser){
            return res.status(400).json({message: 'User does not exist'});
        }

        //Compare the password
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if(!isMatch){
            return res.status(400).json({message: 'Invalid credentials'});
        }

        //store token in cookie
        const token = await generateToken(existingUser._id);
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 30*24*60*60*1000 //30 days
        })

        return res.status(200).json({message: 'Login successful'});
    }catch(err){
        return res.status(500).json({message: err.message});
    }
}


//LogOut
 const logout = (req, res) => {
    try {
        res.cookie('token', '', {
            httpOnly: true,
            expires: new Date(0), // Set expiration to the past
            sameSite: 'none',
            secure: true
        });
        res.status(200).json({ message: "Logged out successfully." });
    } catch (error) {
        res.status(500).json({ message: "Server error during logout." });
    }
};

module.exports = {signup, login, logout};