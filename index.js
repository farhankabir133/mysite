const { onRequest } = require("firebase-functions/v2/https");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const nodemailer = require("nodemailer");
const { getSystemPrompt } = require("./chatbot_personality");

// -----------------------------
// Helper function to set CORS headers
// -----------------------------
const setCorsHeaders = (res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");
};

// -----------------------------
// KB Integration Function
// -----------------------------
async function getKBContext(userMessage) {
  const kbEntries = [
    "Farhan Kabir is a full-stack software developer.",
    "He specializes in Flutter, Node.js, Web3, and AI projects.",
    "He has built portfolio websites, music apps, and chatbots.",
    "He is available for freelance work and consultations."
  ];
  return kbEntries.join("\n");
}

// -----------------------------
// Gemini Chatbot Endpoint
// -----------------------------
exports.getGeminiResponse = onRequest({ secrets: ["GEMINI_API_KEY"] }, async (req, res) => {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  if (!req.body || !req.body.message) {
    res.status(400).send({ error: 'Missing "message" in request body' });
    return;
  }

  const { message } = req.body;

  try {
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) throw new Error("GEMINI_API_KEY is not set");

    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    const kbContext = await getKBContext(message);
    const systemPrompt = `${getSystemPrompt()}\n\nKnowledge Base:\n${kbContext}`;

    const result = await model.generateContent({
      contents: [
        { role: "user", parts: [{ text: getSystemPrompt() + "\n" + message }] }
      ]
    });

    console.log("Gemini API raw result:", JSON.stringify(result, null, 2));

    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text
      || result?.response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) throw new Error("No text returned from Gemini API");

    res.status(200).send({ response: text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).send({ error: error.message || "Unable to get response from Gemini" });
  }
});

// -----------------------------
// Contact Form Endpoint
// -----------------------------
exports.contact = onRequest({ secrets: ["GMAIL_EMAIL", "GMAIL_APP_PASS"] }, async (req, res) => {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    res.status(400).send({ error: "Missing one or more required fields: name, email, message" });
    return;
  }

  try {
    const user = process.env.GMAIL_EMAIL;
    const pass = process.env.GMAIL_APP_PASS;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass }
    });

    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: user,
      subject: "New Contact Form Submission",
      text: message
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send({ error: "Failed to send message." });
  }
});
