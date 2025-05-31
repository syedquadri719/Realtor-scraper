const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Optional: Middleware for parsing JSON if needed
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('🏠 Realtor Scraper is live!');
});

// /scrape route
app.get('/scrape', async (req, res) => {
  const { location, radius } = req.query;

  if (!location || !radius) {
    return res.status(400).json({ error: 'Missing location or radius parameter' });
  }

  // TODO: Replace with actual scraping logic later
  return res.json({
    message: `Searching properties near ${location} within ${radius} miles`,
    listings: [] // Example: later you’ll populate this with real scraped data
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
