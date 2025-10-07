export default function handler(req, res) {
    return res.json({
        status: "OK",
        apiKey: process.env.OPENROUTER_API_KEY ? "Found" : "Missing"
    });
}
