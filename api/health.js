export default function handler(req, res) {
    return res.status(200).json({
        status: "OK",
        apiKey: process.env.OPENROUTER_API_KEY ? "✅ Found" : "❌ Missing",
        keyPreview: process.env.OPENROUTER_API_KEY ? 
            process.env.OPENROUTER_API_KEY.substring(0, 15) + "..." : 
            "None",
        timestamp: new Date().toISOString()
    });
}
