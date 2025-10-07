export default function handler(req, res) {
    return res.status(200).json({
        status: "OK",
        apiKey: process.env.OPENROUTER_API_KEY ? "✅ Found" : "❌ Missing",
        keyLength: process.env.OPENROUTER_API_KEY ? process.env.OPENROUTER_API_KEY.length : 0,
        timestamp: new Date().toISOString()
    });
}
