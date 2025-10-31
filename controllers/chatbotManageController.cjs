const OpenAI = require("openai");
const dotenv = require("dotenv");

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // api key from env
});

exports.chatbotReply = async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "OpenAI API key not configured" });
    }

    const { message, history } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Invalid or missing 'message' in body" });
    }

    // Ensure history is an array of { role, content } objects
    const safeHistory = Array.isArray(history)
      ? history.filter(h => h && (h.role === "user" || h.role === "assistant" || h.role === "system") && typeof h.content === "string")
      : [];

    const systemPrompt = `
          You are 'Hava', the official AI assistant of the university's online student leave system, HavaBreak.

          Your audience: students only (never staff or employees).
          Your main job: guide students about leave application matters.

          When replying:
          - Always address the user as "Student" or "Dear Student".
          - Never use "employee", "staff", or "worker" in your responses.
          - Keep tone polite, concise, and professional (like a university admin).
          - Always use simple English; avoid jargon or overly formal wording.
          - Give constructive suggestions (e.g., good leave names, number of days, evidence recommendations).
          - If a student asks for a suggestion (e.g., leave title, reason wording, etc.), always provide at least one helpful example.
          - NEVER generate or write full leave letters or templates; politely tell them to apply in HavaBreak.
          - Refuse all non-leave-related topics.

          University Leave Policies:
          1. Weekends and public holidays do NOT count as leave days.
          2. "Predicted Leave Balance" decreases immediately when a leave request is submitted. If rejected, it increases back.
          3. "Current Leave Balance" decreases only after final approval.
          4. Leave exceeding 7 days may require a meeting with the Head of Programme (HOP).
          5. Always attach evidence (like doctor’s letter) when applying leave — requests without documents may be rejected.
          6. HOP's final approval determines whether the leave is officially approved.
          7. leave types of the HavaBreak are 'sick leave, emergency leave, personal leave, family leave, official leave, study leave, other'
          `;

    const messages = [
      { role: "system", content: systemPrompt.trim() },
      ...safeHistory,
      { role: "user", content: message }
    ];

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      // optional: max_tokens: 512,
    });

    // Robust extraction for different SDK response shapes:
    const reply =
      completion?.choices?.[0]?.message?.content ||
      completion?.choices?.[0]?.message ||
      completion?.output?.[0]?.content?.[0]?.text ||
      (typeof completion === "string" ? completion : JSON.stringify(completion).slice(0, 1000));

    res.json({ reply });
  } catch (err) {
    console.error("AI Chat error:", (err?.response?.data) ? err.response.data : err.message || err);
    res.status(500).json({ error: "AI chat failed" });
  }
};

