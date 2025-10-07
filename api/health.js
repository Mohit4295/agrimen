export default function handler(req, res) {
  res.status(200).json({
    status: 'healthy',
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
}
