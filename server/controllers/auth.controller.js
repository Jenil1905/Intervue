const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const generateToken = require('../token');
const transporter = require('../nodemailer');

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
            return res.status(400).json({message: 'User with this email already exists'});
        }
      
        //validate password length
        if(password.length < 6){
            return res.status(400).json({message: 'Password must be at least 6 characters long'});
        }
    
        //Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //Create a new user
        const newUser = await User.create({name , email , password:hashedPassword});

        //store token in cookie
        const token = await generateToken(newUser._id);
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 30*24*60*60*1000 //30 days
        });

        // Send Welcome Email (async, non-blocking error handling)
        if (process.env.EMAIL_USER) {
            transporter.sendMail({
                from: `"Intervue Team" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: 'Welcome to Intervue! 🚀',
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                        <h2 style="color: #2563eb;">Welcome to Intervue, ${name}!</h2>
                        <p>We are thrilled to have you on board.</p>
                        <p>With Intervue, you can practice realistic AI-driven mock interviews, track your growth, and sharpen your tech skills for top tech companies.</p>
                        <a href="https://intervue-frontend-ten.vercel.app/dashboard" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 15px;">Start Your First Interview</a>
                        <br/><br/>
                        <p>Best regards,<br/>The Intervue Team</p>
                    </div>
                `
            }).then(() => console.log(`Welcome email sent to ${email}`))
              .catch(err => console.error("Error sending welcome email:", err.message));
        }

        return res.status(201).json({
            message: 'User created successfully',
            token,
            user: { _id: newUser._id, name: newUser.name, email: newUser.email }
        });
     
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
            return res.status(400).json({message: 'User does not exist with this email'});
        }

        //Compare the password
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if(!isMatch){
            return res.status(400).json({message: 'Invalid credentials. Incorrect password.'});
        }

        //store token in cookie
        const token = await generateToken(existingUser._id);
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 30*24*60*60*1000 //30 days
        });

        return res.status(200).json({
            message: 'Login successful',
            token,
            user: { _id: existingUser._id, name: existingUser.name, email: existingUser.email, phone_number: existingUser.phone_number, profile_picture: existingUser.profile_picture }
        });
    }catch(err){
        return res.status(500).json({message: err.message});
    }
}

//LogOut
const logout = (req, res) => {
    try {
        res.cookie('token', '', {
            httpOnly: true,
            expires: new Date(0),
            secure: true,
            sameSite: "none"
        });
        res.status(200).json({ message: "Logged out successfully." });
    } catch (error) {
        res.status(500).json({ message: "Server error during logout." });
    }
};

module.exports = {signup, login, logout};