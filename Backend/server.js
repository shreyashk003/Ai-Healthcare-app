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

    // Input Validation
    if (!symptom || !language) {
      return res.status(400).json({ error: 'Missing symptom or language' });
    }

    console.log("✅ Received:", { symptom, language });

    // Initialize Gemini model (assume this is configured elsewhere)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Create prompt
    const prompt = `
You are a rural health assistant. A patient says: "${symptom}".
Advise them in simple terms in ${language} language.
Respond in JSON format:
{
  "patient_message": "...",
  "relief_tips": ["...", "..."],
  "possible_causes": ["...", "..."],
  "emergency_signs": ["...", "..."],
  "important_note": "..."
}
    `;

    const result = await model.generateContent(prompt);
    const responseText = result?.response?.text();

    if (!responseText) {
      return res.status(502).json({ error: 'No response from the AI model' });
    }

    // Strip markdown syntax like ```json
    const cleaned = responseText.replace(/```json|```/g, '').trim();

    // Try parsing JSON response
    try {
      const parsed = JSON.parse(cleaned);
      return res.json(parsed);
    } catch (parseErr) {
      console.warn("⚠️ Initial parse failed, trying fallback...");
      const fallbackJSON = cleaned.substring(cleaned.indexOf('{'), cleaned.lastIndexOf('}') + 1);
      const parsed = JSON.parse(fallbackJSON);
      return res.json(parsed);
    }

  } catch (err) {
    console.error("❌ Error in /api/diagnose:", err.message);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

// AI MENTOR: Concept explanation
app.post("/ask", async (req, res) => {
  const { query } = req.body;
  const prompt = `You are a helpful AI mentor. Explain this concept clearly: ${query}`;

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
    const tips = await tipsCollection.find({ tip: { $ne: null, $exists: true, $ne: "" } }).toArray();
    res.json({ tips: tips.map(t => t.tip) });
  } catch (err) {
    console.error("❌ Error in GET /tips:", err);
    res.status(500).json({ error: "Failed to get health tips" });
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
