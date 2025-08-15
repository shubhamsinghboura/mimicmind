const express = require("express");
const cors = require("cors");
const fs = require("fs");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const historyFilePath = "./chatHistory.json";

let conversationHistory = {
  hitesh: [],
  piyush: []
};
function loadHistoryFromFile() {
  if (fs.existsSync(historyFilePath)) {
    try {
      const data = fs.readFileSync(historyFilePath, "utf-8");
      conversationHistory = JSON.parse(data);
      console.log("✅ Chat history loaded from file.");
    } catch (err) {
      console.error("❌ Error reading chat history file:", err);
    }
  } else {
    console.log("⚠️ No chat history file found. Starting fresh.");
  }
}

function saveHistoryToFile() {
  try {
    fs.writeFileSync(historyFilePath, JSON.stringify(conversationHistory, null, 2));
    console.log("💾 Chat history saved.");
  } catch (err) {
    console.error("❌ Error saving chat history:", err);
  }
}

loadHistoryFromFile();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const personas = {
  hitesh: `You are Hitesh Choudhary, the tech educator from the YouTube channel "Chai aur Code" with 721k subscribers and over 600 uploaded videos. 
  - Always start replies with "Haanji". 
  - Talk in a friendly, motivating, and fun style. 
  - Use the same language as the user: reply in English if the user writes in English, in Hindi if the user writes in Hindi. 
  - Explain concepts with simple examples, analogies, and step-by-step guidance. 
  - Add light humor if appropriate. 
  - Focus on coding, programming languages, web/app development, and career guidance.`,

  piyush: `You are Piyush Garg, a Chill Mentor & Software Engineering Expert. 
  - Talk in a friendly, calm, and smooth style. 
  - Explain concepts clearly, making hard ideas simple. 
  - Encourage curiosity, experimentation, and stress-free learning. 
  - Guide students through real-world projects like Next.js, WebRTC, and more. 
  - Use light humor and relatable analogies when appropriate. 
  - Focus on career growth, practical coding skills, and building confidence in software development. 
  - Known for smooth delivery, chill demeanor, and making learning enjoyable.`,
};
// ---------- API Route ----------
app.post("/api/chat", async (req, res) => {
  const { persona, message } = req.body;

  if (!personas[persona]) {
    return res.status(400).json({ error: "Persona not found" });
  }

  try {
    conversationHistory[persona].push({ role: "user", content: message });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: personas[persona] },
        ...conversationHistory[persona]
      ]
    });

    const aiMessage = completion.choices[0].message.content;
    conversationHistory[persona].push({ role: "assistant", content: aiMessage });
    saveHistoryToFile();

   res.json({ response: aiMessage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
