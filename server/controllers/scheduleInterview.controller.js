const ScheduleInterview = require('./../models/scheduleInterview.model.js');
const User = require('./../models/user.model.js');
const transporter = require('./../nodemailer.js');

//logic for storing the scheduled interview(making of a new scheduled interview)
const scheduleInterviews = async (req,res)=>{
      try {
        const { topic, scheduledTime } = req.body;
        const userId = req.userId; // From isAuth middleware

        if (!topic || !scheduledTime) {
            return res.status(400).json({ message: "Topic and scheduled time are required." });
        }

        const newScheduledInterview = new ScheduleInterview({
            userId,
            topic,
            scheduledTime
        });

        await newScheduledInterview.save();
        
        // Send email notification to user if possible
        try {
            const user = await User.findById(userId);
            if (user && user.email && process.env.EMAIL_USER) {
                const formattedTopic = topic.replace(/-/g, ' ').toUpperCase();
                const formattedTime = new Date(scheduledTime).toLocaleString('en-US', {
                    dateStyle: 'full',
                    timeStyle: 'short',
                    timeZone: process.env.TIMEZONE || 'Asia/Kolkata'
                });

                transporter.sendMail({
                    from: `"Intervue Team" <${process.env.EMAIL_USER}>`,
                    to: user.email,
                    subject: `Interview Scheduled: ${formattedTopic}`,
                    html: `
                        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                            <h2 style="color: #2563eb;">Interview Scheduled! 📅</h2>
                            <p>Hi <b>${user.name}</b>,</p>
                            <p>Your mock interview session has been successfully scheduled:</p>
                            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
                                <p style="margin: 5px 0;"><b>Topic:</b> ${formattedTopic}</p>
                                <p style="margin: 5px 0;"><b>Scheduled Date & Time:</b> ${formattedTime}</p>
                            </div>
                            <p>We will send you a reminder shortly before your interview begins.</p>
                            <a href="https://intervue-frontend-ten.vercel.app/dashboard" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 15px;">Go to Dashboard</a>
                        </div>
                    `
                }).then(() => console.log(`Schedule confirmation email sent to ${user.email}`))
                  .catch(err => console.error("Error sending schedule email:", err.message));
            }
        } catch (emailErr) {
            console.error("Error sending confirmation email:", emailErr);
        }

        res.status(201).json({ message: 'Interview scheduled successfully.', interview: newScheduledInterview });

    } catch (error) {
        console.error("Error scheduling interview:", error);
        res.status(500).json({ message: 'Server error while scheduling.' });
    }
}

//getting the scheduled interview
const getScheduledInterviews = async (req, res) => {
    try {
        const userId = req.userId;

        const interviews = await ScheduleInterview.find({ userId: userId, status: 'scheduled' })
            .sort({ scheduledTime: 1 }); // 1 means ascending order (soonest first)
        
        res.status(200).json({ interviews });

    } catch (error) {
        console.error("Error fetching scheduled interviews:", error);
        res.status(500).json({ message: 'Server error fetching scheduled interviews.' });
    }
};

// deleting a scheduled interview
const deleteScheduledInterview = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const interview = await ScheduleInterview.findOneAndDelete({ _id: id, userId: userId });
        if (!interview) {
            return res.status(404).json({ message: 'Scheduled interview not found.' });
        }

        res.status(200).json({ message: 'Scheduled interview deleted successfully.' });
    } catch (error) {
        console.error("Error deleting scheduled interview:", error);
        res.status(500).json({ message: 'Server error deleting scheduled interview.' });
    }
};

module.exports = { scheduleInterviews, getScheduledInterviews, deleteScheduledInterview };