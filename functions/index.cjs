const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const { initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { GoogleGenAI } = require("@google/genai");

initializeApp();

const GEMINI_API_KEY = defineSecret("GEMINI_API_KEY");
const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-2.5-flash-preview-05-20";
const MAX_CURRENT_MESSAGE_CHARS = 8000;
const MAX_SYSTEM_INSTRUCTION_CHARS = 8000;
const MAX_HISTORY_MESSAGES = 20;
const MAX_HISTORY_MESSAGE_CHARS = 8000;
const MAX_PROMPT_CHARS = 40000;

class ClientError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function sendError(response, status, error) {
  response.status(status).json({ error });
}

function requireString(value, field, maxLength) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new ClientError(400, `${field} is required.`);
  }

  if (value.length > maxLength) {
    throw new ClientError(400, `${field} is too long.`);
  }

  return value;
}

function normalizeHistory(history) {
  if (!Array.isArray(history)) {
    return [];
  }

  return history.slice(-MAX_HISTORY_MESSAGES).map((message) => {
    if (!message || (message.sender !== "user" && message.sender !== "ai")) {
      throw new ClientError(400, "conversationHistory contains an invalid sender.");
    }

    return {
      sender: message.sender,
      text: requireString(message.text, "conversationHistory.text", MAX_HISTORY_MESSAGE_CHARS),
    };
  });
}

function buildConversationContent(systemInstruction, conversationHistory, currentMessage) {
  let content = `${systemInstruction}\n\n`;

  if (conversationHistory.length > 0) {
    content += "Previous conversation:\n";
    conversationHistory.forEach((message) => {
      content += `${message.sender === "user" ? "User" : "Assistant"}: ${message.text}\n`;
    });
    content += "\n";
  }

  content += `User: ${currentMessage}`;

  if (content.length > MAX_PROMPT_CHARS) {
    throw new ClientError(400, "AI request is too long.");
  }

  return content;
}

async function verifyFirebaseUser(request) {
  const authorization = request.get("authorization") || "";
  const match = authorization.match(/^Bearer (.+)$/);
  if (!match) {
    throw new ClientError(401, "Authentication is required.");
  }

  try {
    return await getAuth().verifyIdToken(match[1]);
  } catch (error) {
    throw new ClientError(401, "Authentication is required.");
  }
}

exports.generateAiResponse = onRequest(
  {
    cors: true,
    secrets: [GEMINI_API_KEY],
    timeoutSeconds: 60,
    memory: "256MiB",
  },
  async (request, response) => {
    response.set("Cache-Control", "no-store");

    if (request.method !== "POST") {
      response.set("Allow", "POST");
      sendError(response, 405, "Method not allowed.");
      return;
    }

    try {
      await verifyFirebaseUser(request);

      const body = request.body || {};
      const currentMessage = requireString(
        body.currentMessage,
        "currentMessage",
        MAX_CURRENT_MESSAGE_CHARS
      );
      const systemInstruction = requireString(
        body.systemInstruction,
        "systemInstruction",
        MAX_SYSTEM_INSTRUCTION_CHARS
      );
      const conversationHistory = normalizeHistory(body.conversationHistory);
      const contents = buildConversationContent(
        systemInstruction,
        conversationHistory,
        currentMessage
      );

      const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY.value() });
      const aiResponse = await ai.models.generateContent({
        model: MODEL_NAME,
        contents,
      });

      if (!aiResponse.text) {
        throw new Error("No response text received from the AI provider.");
      }

      response.status(200).json({ text: aiResponse.text });
    } catch (error) {
      if (error instanceof ClientError) {
        sendError(response, error.status, error.message);
        return;
      }

      console.error("AI provider request failed", error);
      sendError(response, 502, "AI provider request failed.");
    }
  }
);
