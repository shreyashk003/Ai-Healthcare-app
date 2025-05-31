const express = require("express");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

// === Google GenAI SDK ===
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = process.env.PORT || 9000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// MongoDB Setup
const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

let db;
let appointmentsCollection;
let recoveryCollection;
let tipsCollection;

async function connectDB() {
  try {
    await client.connect();
    db = client.db(process.env.DB_NAME || "healthAssistantDB");
    appointmentsCollection = db.collection("appointments");
    recoveryCollection = db.collection("recoveryLogs");
    tipsCollection = db.collection("healthTips");
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}
connectDB();

// === GOOGLE GENAI CONFIG ===
const GOOGLE_API_KEY = process.env.GENAI_API_KEY;
const GENAI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`;
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

// === Routes ===

// SYMPTOM CHECKER
app.post("/api/symptom-check", async (req, res) => {
  const { symptom } = req.body;
  if (!symptom) return res.status(400).json({ error: "No symptom provided" });

  const prompt = `
You are a rural health assistant. A patient says: "${symptom}". Give advice.

Respond with a JSON object exactly, like this:
{
  "patient_message": "...",
  "relief_tips": ["...", "..."],
  "possible_causes": ["...", "..."],
  "emergency_signs": ["...", "..."],
  "important_note": "..."
}
`;

  try {
    const response = await axios.post(GENAI_ENDPOINT, {
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });

    let output = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    output = output.replace(/```json|```/g, ""); // clean markdown
    res.json(JSON.parse(output));
  } catch (error) {
    console.error("❌ Symptom checker error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to get health guidance." });
  }
});

app.post('/api/diagnose', async (req, res) => {
  try {
    const { symptom, language } = req.body;
    if (!symptom || !language) return res.status(400).json({ error: 'Missing symptom or language' });

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
You are a rural health assistant. Patient says: "${symptom}". Reply in ${language}.
Give only this JSON (no extra text):
{
  "patient_message": "...",
  "relief_tips": ["..."],
  "possible_causes": ["..."],
  "emergency_signs": ["..."],
  "important_note": "...",
  "references": ["..."]
}
    `.trim();

    const result = await model.generateContent(prompt);
    const text = result?.response?.text()?.replace(/```json|```/g, '').trim();
    const json = JSON.parse(text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1));

    return res.json(json);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

app.post("/ask", async (req, res) => {
  const { query } = req.body;
  const lowercaseQuery = query.trim().toLowerCase();

  // Hard-coded short responses
  const shortReplies = {
    "hi": "Hello! What can I help you with?",
    "hello": "Hi there! Got a doubt?",
    "hey": "Hey! What would you like to know?",
    "good morning": "Good morning! How can I assist you?",
    "good evening": "Good evening! Need help with something?",
    "thanks": "You're welcome!",
    "thank you": "Glad I could help!"
  };

  // Myth Buster specific logic
  if (lowercaseQuery.includes("myth buster") || lowercaseQuery.includes("mythbuster")) {
    return res.send({
      response: "Myth Buster is your AI mentor chatbot – quick, clear answers to tech questions."
    });
  }

  // Check for direct greeting and return short message
  if (shortReplies[lowercaseQuery]) {
    return res.send({ response: shortReplies[lowercaseQuery] });
  }

  // Fallback for all other questions – still concise
  const prompt = `
You are an AI mentor. Answer the user's question briefly and clearly in less than 3 short paragraphs. 
Avoid over-explaining. Be helpful but to-the-point.

User's question: ${query}
`.trim();

  try {
    const response = await axios.post(GENAI_ENDPOINT, {
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });

    const content = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No answer found.";
    res.send({ response: content });
  } catch (err) {
    console.error("❌ Error in /ask:", err.response?.data || err.message);
    res.status(500).send({ error: "Failed to get answer from GenAI." });
  }
});

// AI MENTOR: Study suggestions
app.post("/suggest", async (req, res) => {
  const studentProfile = req.body.profile || "The student is struggling with Operating Systems and hasn’t studied DBMS yet.";
  const prompt = `You are an AI mentor. Given this student profile: ${studentProfile}, suggest the next best topic to study and explain why.`;

  try {
    const response = await axios.post(GENAI_ENDPOINT, {
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });

    const content = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No suggestion generated.";
    res.send({ response: content });
  } catch (err) {
    console.error("❌ Error in /suggest:", err.response?.data || err.message);
    res.status(500).send({ error: "Failed to get suggestion from GenAI." });
  }
});

// Appointment booking
app.post('/appointments', async (req, res) => {
  const { name, symptoms, date } = req.body;
  if (!name || !symptoms || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await appointmentsCollection.insertOne({ name, symptoms, date, createdAt: new Date() });
    res.status(200).json({ message: 'Appointment booked' });
  } catch (err) {
    console.error("❌ Error in POST /appointments:", err);
    res.status(500).json({ error: "Failed to book appointment" });
  }
});

app.get('/appointments', async (req, res) => {
  try {
    const appointments = await appointmentsCollection.find({}).toArray();
    res.json(appointments);
  } catch (err) {
    console.error("❌ Error in GET /appointments:", err);
    res.status(500).json({ error: "Failed to get appointments" });
  }
});

// Basic chatbot
app.post('/chatbot', (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ reply: 'No message received' });

  let reply = "I'm your AI health assistant. Please consult a doctor for urgent symptoms.";
  if (message.toLowerCase().includes("fever")) reply = "You might have an infection. Stay hydrated and consult a doctor.";
  if (message.toLowerCase().includes("headache")) reply = "Try to rest and avoid screen time. If it persists, seek medical advice.";

  res.json({ reply });
});

// Health tips
app.get('/tips', async (req, res) => {
  try {
    const db = getDb(); // get your db connection
    const randomTips = await db.collection('healthTips').aggregate([{ $sample: { size: 8 } }]).toArray();

    const onlyTextTips = randomTips.map(tip => tip.tipText);
    res.json({ tips: onlyTextTips });
  } catch (error) {
    console.error('Failed to fetch random health tips:', error);
    res.status(500).json({ tips: [], error: 'Failed to fetch tips' });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { name, password } = req.body;

  try {
    await client.connect();
    const db = client.db("healthAssistantDB");
    const user = await db.collection("users").findOne({ name, password });

    if (user) {
      res.json({ success: true, user });
    } else {
      res.json({ success: false });
    }
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Recovery logs
app.post('/recovery', async (req, res) => {
  const { user, exercise, medicine } = req.body;
  if (!user) return res.status(400).json({ error: 'User is required' });

  try {
    await recoveryCollection.updateOne(
      { user },
      { $push: { logs: { exercise, medicine, timestamp: new Date() } } },
      { upsert: true }
    );
    res.json({ message: 'Log saved' });
  } catch (err) {
    console.error("❌ Error in POST /recovery:", err);
    res.status(500).json({ error: "Failed to save recovery log" });
  }
});

app.get('/recovery/:user', async (req, res) => {
  const { user } = req.params;
  try {
    const record = await recoveryCollection.findOne({ user });
    res.json(record?.logs || []);
  } catch (err) {
    console.error("❌ Error in GET /recovery/:user:", err);
    res.status(500).json({ error: "Failed to get recovery logs" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 AI Mentor & Health Assistant Server running on port ${PORT}`);
});
