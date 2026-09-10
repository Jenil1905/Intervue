const express = require('express');
const app = express();
const connectDB = require('./connection');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const cron = require('node-cron');
const transporter = require('./nodemailer.js');
const ScheduleInterview = require('./models/scheduleInterview.model.js');

// Routes
const authRoutes = require('./routes/auth.routes.js');
const verifyRoutes = require('./routes/verifyRoutes.js');
const userRoutes = require('./routes/user.routes.js');
const aiRoutes = require('./routes/aiRoutes.js');
const interviewRoutes = require('./routes/interview.routes.js');
const scheduleInterviewRoutes = require('./routes/scheduleInterview.routes.js');
const feedbackRoutes = require('./routes/feedback.routes.js');

// Connect to DB
connectDB(process.env.dbUrl);

// Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ CORS configuration for dev + production
const allowedOrigins = [
  'http://localhost:5173', 
  'https://intervue-frontend-ten.vercel.app'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow Postman / curl
    const isAllowed = allowedOrigins.some(o => origin.startsWith(o));
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS: ' + origin));
    }
  },
  credentials: true
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', verifyRoutes); // verify route
app.use('/api/user', userRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/schedule-interviews', scheduleInterviewRoutes);
app.use('/api/feedback', feedbackRoutes);

// ✅ Cron job for sending interview reminders (runs every minute, checks interviews starting within 2 hours)
cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();
    const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    const upcomingInterviews = await ScheduleInterview.find({
      scheduledTime: { $gte: now, $lte: twoHoursFromNow },
      status: 'scheduled',
      reminderSent: false
    }).populate('userId', 'email name');

    for (const interview of upcomingInterviews) {
      if (!interview.userId || !interview.userId.email) continue;

      const formattedTopic = interview.topic.replace(/-/g, ' ').toUpperCase();
      const formattedTime = new Date(interview.scheduledTime).toLocaleString('en-US', {
        dateStyle: 'full',
        timeStyle: 'short',
        timeZone: process.env.TIMEZONE || 'Asia/Kolkata'
      });

      const mailOptions = {
        from: `"Intervue Reminder" <${process.env.EMAIL_USER}>`,
        to: interview.userId.email,
        subject: `⏰ Reminder: Your ${formattedTopic} Interview is in 2 hours!`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #2563eb;">Interview Reminder! ⏰</h2>
            <p>Hi <b>${interview.userId.name}</b>,</p>
            <p>This is a reminder that your mock interview on <b>${formattedTopic}</b> is scheduled for <b>${formattedTime}</b> (in less than 2 hours)!</p>
            <p>Make sure your microphone is ready and you are in a quiet environment.</p>
            <a href="https://intervue-frontend-ten.vercel.app/dashboard" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 15px;">Join Dashboard</a>
          </div>
        `
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`Reminder email sent to ${interview.userId.email} for ${formattedTopic}`);
        interview.reminderSent = true;
        await interview.save();
      } catch (emailErr) {
        console.error(`Failed to send reminder email to ${interview.userId.email}:`, emailErr.message);
      }
    }
  } catch (error) {
    console.error("Error in cron job:", error);
  }
});
 app.get('/', (req, res) => {
    res.send('Welcome to the Intervue API');
});

// ✅ Start server (use PORT from Render if available)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
