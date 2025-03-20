import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CryptoTable from './components/CryptoTable';
import './App.css';

function App() {
  const [cryptoData, setCryptoData] = useState([]);
  const [balance, setBalance] = useState(1000); // Starting balance
  const [portfolio, setPortfolio] = useState([]); // User's portfolio

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/crypto');
        setCryptoData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to fetch data. Please check the backend.');
      }
    };

    fetchData(); // Fetch data on reload
    const interval = setInterval(fetchData, 60000); // Fetch data every 1 minute
    return () => clearInterval(interval); 
  }, []);

  const handlePurchase = async (cryptoId, quantity) => {
    try {
      const response = await axios.post('http://localhost:5001/api/purchase', { cryptoId, quantity });
      setBalance(response.data.balance);

      // Update portfolio
      const crypto = cryptoData.find((c) => c.id === cryptoId);
      if (crypto) {
        setPortfolio((prevPortfolio) => [
          ...prevPortfolio,
          {
            id: cryptoId,
            name: crypto.name,
            symbol: crypto.symbol,
            quantity: quantity,
            cost: crypto.current_price * quantity,
            timestamp: Date.now(), // Add timestamp to differentiate each purchase
          },
        ]);
      }

      alert(response.data.message);
    } catch (error) {
      if (error.response) {
        alert(error.response.data.error || 'Failed to purchase cryptocurrency');
      } else if (error.request) {
        alert('No response from the server. Please check your connection.');
      } else {
        alert('An error occurred. Please try again.');
      }
      console.error('Error during purchase:', error);
    }
  };

  const getCurrentValue = (portfolioItem) => {
    const crypto = cryptoData.find((c) => c.id === portfolioItem.id);
    if (crypto) {
      return crypto.current_price * portfolioItem.quantity;
    }
    return 0;
  };

  //crypto portfolio
  return (
    <div className="App">
      <h1>CryptoSim</h1>
      <p>Wallet: ${balance}</p>
      <CryptoTable cryptoData={cryptoData} onPurchase={handlePurchase} />

      <h2>Your Portfolio</h2>
      {portfolio.length > 0 ? (
        <table className="portfolio-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Symbol</th>
              <th>Quantity</th>
              <th>Total Cost</th>
              <th>Current Value</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.map((item, index) => (
              <tr key={`${item.id}-${item.timestamp}-${index}`}>
                <td>{item.name}</td>
                <td>{item.symbol.toUpperCase()}</td>
                <td>{item.quantity}</td>
                <td>${item.cost.toLocaleString()}</td>
                <td>${getCurrentValue(item).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No cryptocurrencies purchased yet.</p>
      )}
    </div>
  );
}

export default App;