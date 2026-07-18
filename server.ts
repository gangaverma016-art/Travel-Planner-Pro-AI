import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded GoogleGenAI client to prevent crashes if key is initially empty
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing. Please set it in the Secrets panel.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// 1. API: Generate Itinerary Route
app.post("/api/generate-itinerary", async (req, res) => {
  try {
    const { destination, budget, duration, travelers, travelStyle, interests, transport } = req.body;

    const ai = getAiClient();

    const prompt = `Create a highly customized, fun, and comprehensive travel itinerary for a trip to "${destination}".
Trip Details:
- Budget Range: ${budget}
- Duration: ${duration} days
- Travelers: ${travelers}
- Travel Style: ${travelStyle}
- Selected Interests: ${interests ? interests.join(", ") : "General"}
- Preferred Transport: ${transport}

Please generate a structured JSON object representing this trip. Use this exact schema:
{
  "destination": "Name of primary city/destination",
  "country": "Country name",
  "tagline": "A fun, adventurous, or romantic travel slogan",
  "summary": "A creative journal summary of this trip from an explorer's perspective (2-3 sentences)",
  "budgetLevel": "Budget level rating like $, $$, $$$, or $$$$",
  "bestSeason": "Month range or season that is best",
  "visaInfo": "Short visa info for international travelers",
  "rating": 4.9,
  "averageTemp": "e.g., 24°C / 75°F",
  "currency": "Local currency",
  "language": "Local language",
  "funFacts": ["Fact 1", "Fact 2", "Fact 3"],
  "budget": {
    "flights": 400,
    "hotels": 350,
    "food": 150,
    "transport": 80,
    "activities": 120,
    "shopping": 70,
    "emergency": 50,
    "total": 1220
  },
  "destinations": [
    {
      "name": "Featured Town/Attraction 1",
      "country": "Country",
      "temp": "23°C",
      "budgetLevel": "$$",
      "rating": 4.8,
      "bestTime": "Spring",
      "visaRequired": "Visa on arrival / No / Yes",
      "attractions": ["Main attraction A", "Secret spot B"],
      "foodToTry": ["Local delicacy X", "Drink Y"],
      "description": "Short magical description of why they should explore this spot"
    }
  ],
  "itinerary": [
    {
      "day": 1,
      "title": "Welcome to Adventure",
      "morning": "Morning itinerary detail...",
      "afternoon": "Afternoon itinerary detail...",
      "evening": "Evening itinerary detail...",
      "cost": 45,
      "notes": "Journal tip: carry local cash"
    }
  ],
  "packingChecklist": [
    {
      "category": "Essentials",
      "items": ["Passport", "Tickets", "Cash"]
    },
    {
      "category": "Clothing",
      "items": ["T-shirts", "Comfortable walking shoes"]
    }
  ],
  "safetyTips": ["Tip A", "Tip B"],
  "emergencyContacts": [
    { "name": "Local Police", "contact": "112 / 911" },
    { "name": "Tourist Hotline", "contact": "+1..." }
  ],
  "travelTips": ["Tip 1", "Tip 2"],
  "postcard": {
    "title": "Postcard from Destination!",
    "message": "Greetings from destination! We're having the best time exploring. Wish you were here!",
    "stampText": "PASSPORT STAMP TEXT",
    "doodleDescription": "Beach, mountains, palm trees, sun"
  }
}

Ensure the "itinerary" array has exactly ${duration} days, matching the duration.
Ensure all budget fields are realistic numbers and represent the average for the travel options.
Make the descriptions colorful, witty, and matching a playful travel explorer notebook style!`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    const data = JSON.parse(text.trim());
    res.json(data);
  } catch (error: any) {
    console.error("Error generating itinerary:", error);
    res.status(500).json({ error: error.message || "Failed to generate itinerary" });
  }
});

// 2. API: Assistant Chat Route
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;

    const ai = getAiClient();

    // Reconstruct the chat with a playful system instruction
    const systemInstruction = `You are "Doodle Guide", a cute, enthusiastic hand-drawn travel assistant and explorer. 
Your tone is incredibly playful, bubbly, and helpful, like a personal travel companion writing in an explorer's notebook. 
You love using travel emojis (✈️, 🌴, 🏔️, 🧭, 🎒, 🗺️) and drawing little mental maps. 
Give quick, practical, creative suggestions! 
Keep responses moderately concise, extremely organized (using bullet points), and always friendly!`;

    const chatHistory = history ? history.map((h: any) => ({
      role: h.role,
      parts: [{ text: h.text }]
    })) : [];

    const chat = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction,
      },
      history: chatHistory,
    });

    const response = await chat.sendMessage({
      message: message,
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Chat error:", error);
    res.status(500).json({ error: error.message || "Chat failed" });
  }
});

// Serve frontend assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
