import React, { useState } from 'react';

function CryptoTable({ cryptoData, onPurchase }) {
  const [sortConfig, setSortConfig] = useState({
    key: null, // Column to sort by (e.g., 'name', 'price', 'market_cap', etc.)
    direction: null, // Sort direction ('asc', 'desc', or null for unsorted)
  });

  // Function to handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'asc') {
        direction = 'desc';
      } else if (sortConfig.direction === 'desc') {
        direction = null; // Reset to unsorted
      }
    }
    setSortConfig({ key, direction });
  };

  // Sort the data
  const sortedData = React.useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return cryptoData;

    return [...cryptoData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [cryptoData, sortConfig]);

  // Function to format volume (optional)
  const formatVolume = (volume) => {
    if (volume >= 1e9) return `${(volume / 1e9).toFixed(2)}B`;
    if (volume >= 1e6) return `${(volume / 1e6).toFixed(2)}M`;
    return volume.toLocaleString();
  };

  // Function to handle purchase
  const handlePurchase = (cryptoId) => {
    const quantity = parseFloat(prompt('Enter quantity to purchase:'));
    if (quantity > 0) {
      onPurchase(cryptoId, quantity);
    }
  };

  return (
    <table className="crypto-table">
      <thead>
        <tr>
          <th onClick={() => handleSort('name')}>
            Name {sortConfig.key === 'name' && (
              sortConfig.direction === 'asc' ? '▲' :
              sortConfig.direction === 'desc' ? '▼' :
              ''
            )}
          </th>
          <th onClick={() => handleSort('symbol')}>
            Symbol {sortConfig.key === 'symbol' && (
              sortConfig.direction === 'asc' ? '▲' :
              sortConfig.direction === 'desc' ? '▼' :
              ''
            )}
          </th>
          <th onClick={() => handleSort('current_price')}>
            Price (USD) {sortConfig.key === 'current_price' && (
              sortConfig.direction === 'asc' ? '▲' :
              sortConfig.direction === 'desc' ? '▼' :
              ''
            )}
          </th>
          <th onClick={() => handleSort('market_cap')}>
            Market Cap {sortConfig.key === 'market_cap' && (
              sortConfig.direction === 'asc' ? '▲' :
              sortConfig.direction === 'desc' ? '▼' :
              ''
            )}
          </th>
          <th onClick={() => handleSort('total_volume')}>
            Volume (24H) {sortConfig.key === 'total_volume' && (
              sortConfig.direction === 'asc' ? '▲' :
              sortConfig.direction === 'desc' ? '▼' :
              ''
            )}
          </th>
          <th onClick={() => handleSort('price_change_percentage_24h')}>
            24H Change {sortConfig.key === 'price_change_percentage_24h' && (
              sortConfig.direction === 'asc' ? '▲' :
              sortConfig.direction === 'desc' ? '▼' :
              ''
            )}
          </th>
          <th>Purchase</th>
        </tr>
      </thead>
      <tbody>
        {sortedData.map((crypto) => (
          <tr key={crypto.id}>
            <td>
              {crypto.name.length > 20 ? `${crypto.name.substring(0, 20)}...` : crypto.name}
            </td>
            <td>{crypto.symbol.toUpperCase()}</td>
            <td>${crypto.current_price.toLocaleString()}</td>
            <td>${crypto.market_cap.toLocaleString()}</td>
            <td>${formatVolume(crypto.total_volume)}</td>
            <td
              className={
                crypto.price_change_percentage_24h >= 0 ? 'positive-change' : 'negative-change'
              }
            >
              {crypto.price_change_percentage_24h.toFixed(2)}%
            </td>
            <td>
              <button onClick={() => handlePurchase(crypto.id)}>Buy</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default CryptoTable;