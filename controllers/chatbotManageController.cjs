const OpenAI = require("openai");
const dotenv = require("dotenv");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // api key from env
});

exports.chatbotReply = async (req, res) => {
  try {
    const { message, history } = req.body;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", 
            content: `
            You are the AI assistant of a university's online leave system.

⚠️ Strict Rules (MUST follow exactly):
1. You MUST NOT generate or write leave letters or templates for students. 
   Doing so will violate the university's system policy.
2. Only provide guidance, rules, and explanations related to leave.
3. Always follow the university's leave policies below.
4. Keep your tone polite, concise, and professional.
5. Refuse any request unrelated to leave.

University Leave Policies:
1. Weekends and public holidays do NOT count as leave days.
2. "Predicted Leave Balance" decreases immediately when a leave request is submitted. 
   If rejected, it increases back.
3. "Current Leave Balance" decreases only after final approval.
4. Leave exceeding 7 days may require a meeting with the Head of Programme.
            `
 
        },
        ...(history || []),
        { role: "user", content: message }
      ],
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    console.error("AI Chat error:", err.response?.data || err.message || err);
    res.status(500).json({ error: "AI chat failed" });
  }
};

