import React, { useState } from 'react';
import axios from 'axios';
import './compare.css';

function Compare() {
  const [playerOne, setPlayerOne] = useState('');
  const [playerTwo, setPlayerTwo] = useState('');
  const [statsOne, setStatsOne] = useState(null);
  const [statsTwo, setStatsTwo] = useState(null);
  const [error, setError] = useState('');

  const fetchStats = async (playerName) => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/player-stats?name=${encodeURIComponent(playerName)}`);
      return response.data;
    } catch (error) {
      setError(`Failed to fetch stats for ${playerName}`);
      console.error(error);
    }
  };

  const calculateAverages = (data) => {
    if (!data || data.length === 0) return [];

    return data.map((season) => {
      const gamesPlayed = season.GP || 1; // Avoid division by zero
      return {
        season: season.SEASON_ID,
        points_per_game: (season.PTS / gamesPlayed).toFixed(1),
        rebounds_per_game: ((season.REB) / gamesPlayed).toFixed(1),
        assists_per_game: ((season.AST) / gamesPlayed).toFixed(1),
      };
    });
  };

  const handleFetchStats = async () => {
    setError('');
    if (playerOne) {
      const dataOne = await fetchStats(playerOne);
      setStatsOne(calculateAverages(dataOne));
    }
    if (playerTwo) {
      const dataTwo = await fetchStats(playerTwo);
      setStatsTwo(calculateAverages(dataTwo));
    }
  };

  return (
    <div className="compare-container">
      <div className="input-group">
        <input
          type="text"
          placeholder="Enter first player name"
          value={playerOne}
          onChange={(e) => setPlayerOne(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter second player name"
          value={playerTwo}
          onChange={(e) => setPlayerTwo(e.target.value)}
        />
        <button onClick={handleFetchStats}>Fetch Stats</button>
      </div>
      {error && <p className="error">{error}</p>}
      <div className="stats-container">
        <div className="player-stats">
          <h3>Stats for {playerOne}</h3>
          {statsOne ? (
            <table>
              <thead>
                <tr>
                  <th>Season</th>
                  <th>PPG</th>
                  <th>RPG</th>
                  <th>APG</th>
                </tr>
              </thead>
              <tbody>
                {statsOne.map((stat, index) => (
                  <tr key={index}>
                    <td>{stat.season}</td>
                    <td>{stat.points_per_game}</td>
                    <td>{stat.rebounds_per_game}</td>
                    <td>{stat.assists_per_game}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No stats available</p>
          )}
        </div>
        <div className="player-stats">
          <h3>Stats for {playerTwo}</h3>
          {statsTwo ? (
            <table>
              <thead>
                <tr>
                  <th>Season</th>
                  <th>PPG</th>
                  <th>RPG</th>
                  <th>APG</th>
                </tr>
              </thead>
              <tbody>
                {statsTwo.map((stat, index) => (
                  <tr key={index}>
                    <td>{stat.season}</td>
                    <td>{stat.points_per_game}</td>
                    <td>{stat.rebounds_per_game}</td>
                    <td>{stat.assists_per_game}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No stats available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Compare;