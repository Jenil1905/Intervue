const express = require('express');
const app = express();
const connectDB = require('./connection');
require('dotenv').config();
connectDB(process.env.dbUrl);
const authRoutes = require('./routes/auth.routes.js');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/user.routes.js');
const cors = require('cors');
const aiRoutes = require('./routes/aiRoutes.js');
const interviewRoutes = require('./routes/interview.routes.js')
const verifyRoutes = require('./routes/verifyRoutes.js')
const scheduleInterviewRoutes = require('./routes/scheduleInterview.routes.js')
const cron = require('node-cron')
const transporter = require('./nodemailer.js')
const ScheduleInterview = require('./models/scheduleInterview.model.js')
const feedbackRoutes = require('./routes/feedback.routes.js')

//Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}))

//Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/interview' , interviewRoutes)
app.use('/api/auth', verifyRoutes)
app.use('/api/schedule-interviews', scheduleInterviewRoutes)
app.use('/api/feedback', feedbackRoutes);


//sending the email
cron.schedule('0 8 * * *', async () => {
    console.log('Running a check for scheduled interviews...'); // This should appear every minute
    
    try {
        const now = new Date();
        const oneMinuteFromNow = new Date(now.getTime() + 60 * 1000);

        const upcomingInterviews = await ScheduleInterview.find({
            scheduledTime: { $gte: now, $lt: oneMinuteFromNow },
            status: 'scheduled',
            reminderSent: false
        }).populate('userId', 'email name');

        if (upcomingInterviews.length > 0) {
            console.log(`Found ${upcomingInterviews.length} upcoming interviews.`);
            // ... email sending logic ...

            for (const interview of upcomingInterviews) {
                // ✅ 1. Define the email content
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: interview.userId.email,
                    subject: `Reminder: Your ${interview.topic} Interview is starting now!`,
                    html: `
                        <h1>Hi ${interview.userId.name},</h1>
                        <p>This is a reminder that your interview on <b>${interview.topic.replace(/-/g, ' ')}</b> is scheduled to begin now.</p>
                        <p>Good luck!</p>
                    `
                };

                // ✅ 2. Send the email
                await transporter.sendMail(mailOptions);
                console.log(`Reminder email sent to ${interview.userId.email}`);

                // ✅ 3. Mark as sent to prevent duplicate emails
                interview.reminderSent = true;
                await interview.save();
            }
        }
    } catch (error) {
        console.error("Error in cron job:", error);
    }
});




app.listen(3000,()=>{
    console.log('Server is running on port 3000');
})