const { generateAIResponse } = require('../service/aiService');

async function generateQuestions(req, res){
    const {topic } = req.params;
      try {
    const questions = await generateAIResponse(topic);
    res.json({ questions });
  } catch (error) {
    console.error("Error generating questions:", error);
    res.status(500).json({ error: error.message });
  }

}

module.exports = { generateQuestions };
