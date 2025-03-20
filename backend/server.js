const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 5001; 

app.use(cors());
app.use(express.json());

//Website currency (resets to 1000 on server start)
let globalBalance = 1000;

// Function to delay execution
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// API endpoint to fetch real-time crypto data
app.get('/api/crypto', async (req, res) => {
  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=25&page=1&sparkline=false'
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data from CoinGecko:', error.message);
    res.status(500).json({ error: 'Failed to fetch data from CoinGecko' });
  }
});

// Get global balance
app.get('/api/balance', (req, res) => {
  res.json({ balance: globalBalance });
});

// Purchase cryptocurrency
app.post('/api/purchase', async (req, res) => {
  const { cryptoId, quantity } = req.body;
  if (!cryptoId || !quantity) {
    return res.status(400).json({ error: 'Crypto ID and quantity are required' });
  }

  try {
    // Add a delay of 6 seconds between requests (10 requests per minute)
    await delay(6000);

    const cryptoResponse = await axios.get(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${cryptoId}&sparkline=false`
    );
    const crypto = cryptoResponse.data[0];
    if (!crypto) {
      return res.status(400).json({ error: 'Invalid cryptocurrency' });
    }

    const totalCost = crypto.current_price * quantity;
    if (globalBalance < totalCost) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Deduct from global balance
    globalBalance -= totalCost;

    res.json({ message: 'Purchase successful', balance: globalBalance });
  } catch (error) {
    console.error('Error during purchase:', error.message);
    res.status(500).json({ error: 'Failed to purchase cryptocurrency' });
  }
});

// Verifies backend is working
app.get('/test', (req, res) => {
    res.json({ message: 'Backend is working!' });
  });
  

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Displays which port is being used
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log('Global balance reset to $1000');
});
