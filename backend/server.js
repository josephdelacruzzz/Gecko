const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 5001;

// Enable CORS for all routes
app.use(cors());

// API endpoint to fetch crypto data
app.get('/api/crypto', async (req, res) => {
  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false'
    );
    console.log('API response:', response.data); // Log the response
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Test route to check if the backend is working
app.get('/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});