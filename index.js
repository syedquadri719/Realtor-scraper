const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

app.get('/api/listings', async (req, res) => {
  const { lat, lng, radius } = req.query;

  if (!lat || !lng || !radius) {
    return res.status(400).json({ error: 'Missing lat, lng, or radius' });
  }

  const searchUrl = `https://www.realtor.com/realestateandhomes-search/geo/${lat},${lng}/radius-${radius}`;

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(searchUrl, { waitUntil: 'networkidle2' });

    await page.waitForSelector('[data-testid="property-card"]', { timeout: 15000 });

    const listings = await page.evaluate(() => {
      const cards = document.querySelectorAll('[data-testid="property-card"]');
      return Array.from(cards).slice(0, 10).map(card => ({
        price: card.querySelector('[data-testid="price"]')?.innerText || null,
        address: card.querySelector('[data-testid="address"]')?.innerText || null,
        beds: card.querySelector('[data-testid="beds"]')?.innerText || null,
        baths: card.querySelector('[data-testid="baths"]')?.innerText || null,
        sqft: card.querySelector('[data-testid="sqft"]')?.innerText || null,
        photo: card.querySelector('img')?.src || null
      }));
    });

    await browser.close();
    res.json({ listings });
  } catch (error) {
    console.error("Scraper error:", error);
    res.status(500).json({ error: 'Failed to load listings', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});