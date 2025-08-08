import express from 'express';
import cors from 'cors';
import { scrapeAmazon } from './scraper.js';

// 1. Initialization
const app = express();
const PORT = 3000;

// 2. Middleware Setup
// Enable CORS to allow requests from the frontend
app.use(cors()); 

// Enable the express app to parse JSON formatted request bodies
app.use(express.json());

// 3. Route Definitions
app.get('/', (req, res) => {
  res.send('<h1>Scraper Server is running!</h1><p>Use the /api/scrape?keyword=your_term endpoint to start a search.</p>');
});

app.get('/api/scrape', async (req, res) => {
  const { keyword } = req.query;

  if (!keyword) {
    return res.status(400).json({ error: 'The "keyword" parameter is required.' });
  }

  try {
    console.log(`Starting scrape for keyword: "${keyword}"`);
    const products = await scrapeAmazon(keyword);
    console.log(`Scraping finished. Found ${products.length} products.`);
    res.json(products);

  } catch (error) {
    console.error('Error in /api/scrape route:', error);
    res.status(500).json({ error: error.message });
  }
});

// 4. Start the Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}. Access http://localhost:${PORT}`);
});