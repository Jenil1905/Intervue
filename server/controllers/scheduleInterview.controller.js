import ScheduleInterview from './../models/scheduleInterview.model.js'

//logic for storing the scheduled interview(making of a new scheduled interview)
export const scheduleInterviews = async (req,res)=>{
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
        
        res.status(201).json({ message: 'Interview scheduled successfully.', interview: newScheduledInterview });

    } catch (error) {
        console.error("Error scheduling interview:", error);
        res.status(500).json({ message: 'Server error while scheduling.' });
    }
}

//getting the scheduled interview
export const getScheduledInterviews = async (req, res) => {
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