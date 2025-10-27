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
  'https://intervue-frontend-n6ml5jws0-jenils-projects-508f8370.vercel.app'
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

// ✅ Cron job for sending interview reminders
cron.schedule('0 8 * * *', async () => {
  console.log('Running a check for scheduled interviews...');

  try {
    const now = new Date();
    const oneMinuteFromNow = new Date(now.getTime() + 60 * 1000);

    const upcomingInterviews = await ScheduleInterview.find({
      scheduledTime: { $gte: now, $lt: oneMinuteFromNow },
      status: 'scheduled',
      reminderSent: false
    }).populate('userId', 'email name');

    for (const interview of upcomingInterviews) {
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

      await transporter.sendMail(mailOptions);
      console.log(`Reminder email sent to ${interview.userId.email}`);

      interview.reminderSent = true;
      await interview.save();
    }
  } catch (error) {
    console.error("Error in cron job:", error);
  }
});

// ✅ Start server (use PORT from Render if available)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
