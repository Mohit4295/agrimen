import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// Helper function to clean DeepSeek response
function extractJSON(text) {
    if (!text) return null;
    
    // Try direct parse first
    try {
        return JSON.parse(text);
    } catch (e) {
        // Remove markdown code blocks
        let cleaned = text
            .replace(/```json\s*/gi, '')
            .replace(/```\s*/g, '')
            .trim();
        
        // Find JSON boundaries
        const firstBrace = cleaned.indexOf('{');
        const lastBrace = cleaned.lastIndexOf('}');
        
        if (firstBrace !== -1 && lastBrace !== -1) {
            cleaned = cleaned.substring(firstBrace, lastBrace + 1);
            try {
                return JSON.parse(cleaned);
            } catch (e) {
                console.error("Failed to parse cleaned JSON:", e);
                return null;
            }
        }
    }
    return null;
}

app.post("/api/crops", async (req, res) => {
  try {
    console.log("📡 API Request received");
    console.log("🔑 Using API Key:", process.env.OPENROUTER_API_KEY ? "✅ Key exists" : "❌ NO KEY FOUND!");
    
    // Optimize the messages for better JSON output
    const optimizedMessages = [
      {
        role: "system",
        content: `You are a Kerala agriculture expert API. 
CRITICAL: Return ONLY valid JSON without any markdown formatting, code blocks, or explanations.

OUTPUT FORMAT:
{"crops":[{"name":"","suitability":0,"reason":"","varieties":"","duration":"","yield":""}],"tips":[""]}

RULES:
1. Include 20-25 Kerala crops
2. Suitability: integer 0-100 based on:
   - Month match (50%), Soil (20%), Weather (25%), pH/Water (5%)
3. Sort by suitability descending
4. If month doesn't match crop season, suitability <= 40
5. If temp >45°C or <10°C or pH outside 3.5-9.0, all suitability <20%

NO MARKDOWN. NO EXTRA TEXT. ONLY JSON.`
      },
      req.body.messages[1] // User message with parameters
    ];
    
    console.log("🚀 Calling OpenRouter/DeepSeek API...");
    
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Kerala Crop Recommender"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat",
        messages: optimizedMessages,
        temperature: 0.1,  // Very low for consistent JSON
        max_tokens: 4000,
        top_p: 0.9,        // Slightly focused sampling
        response_format: { type: "json_object" }  // Force JSON if supported
      })
    });

    console.log("📊 Response status:", response.status);
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error("❌ API Error:", data);
      return res.status(response.status).json({ 
        error: data.error || "API request failed",
        details: data 
      });
    }
    
    // Log the raw response for debugging
    console.log("📝 Raw AI response (first 500 chars):", 
                data.choices?.[0]?.message?.content?.substring(0, 500));
    
    // Try to clean the response if needed
    if (data.choices?.[0]?.message?.content) {
      const content = data.choices[0].message.content;
      
      // Check if it's valid JSON
      try {
        JSON.parse(content);
        console.log("✅ Response is valid JSON");
      } catch (e) {
        console.log("⚠️ Response needs cleaning, attempting to extract JSON...");
        
        // Try to extract and clean JSON
        const cleaned = extractJSON(content);
        if (cleaned) {
          console.log("✅ Successfully cleaned JSON");
          // Replace the content with cleaned JSON
          data.choices[0].message.content = JSON.stringify(cleaned);
        } else {
          console.error("❌ Failed to extract valid JSON from response");
          console.error("Full response:", content);
        }
      }
    }
    
    console.log("✅ Sending response to frontend");
    res.json(data);
    
  } catch (err) {
    console.error("🔥 Server error:", err);
    res.status(500).json({ 
      error: "Server error", 
      message: err.message,
      stack: err.stack 
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    apiKey: process.env.OPENROUTER_API_KEY ? "Configured" : "Missing",
    server: "Kerala Crop Recommender",
    model: "deepseek/deepseek-chat"
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🌱 Kerala Crop Recommender Server Started");
  console.log(`✅ Server running: http://localhost:${PORT}`);
  console.log(`🔑 API Key: ${process.env.OPENROUTER_API_KEY ? "✅ Loaded" : "❌ Missing"}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  
  if (!process.env.OPENROUTER_API_KEY) {
    console.error("⚠️ WARNING: OPENROUTER_API_KEY not found in .env file!");
    console.error("Add this to your .env file: OPENROUTER_API_KEY=your-key-here");
  }
});