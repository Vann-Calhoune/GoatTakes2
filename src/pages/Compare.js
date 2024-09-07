import React, { useState } from 'react';
import axios from 'axios';
import './compare.css';

function Compare() {
  const [playerOne, setPlayerOne] = useState('');
  const [playerTwo, setPlayerTwo] = useState('');
  const [statsOne, setStatsOne] = useState(null);
  const [statsTwo, setStatsTwo] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchStats = async (playerName) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://127.0.0.1:5000/api/player-stats?name=${encodeURIComponent(playerName)}`
      );
      return response.data;
    } catch (error) {
      setError(`Failed to fetch stats for ${playerName}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAverages = (data) => {
    if (!data || data.length === 0) return [];

    return data.map((season) => {
      if (season.SEASON_ID === 'Career') {
        // For the career row, use the values as they are
        return {
          season: season.SEASON_ID,
          team: season.TEAM_ABBREVIATION || '',
          games_played: season.GP,
          minutes_per_game: season.MIN.toFixed(1),
          points_per_game: season.PTS.toFixed(1),
          rebounds_per_game: season.REB.toFixed(1),
          assists_per_game: season.AST.toFixed(1),
          blocks_per_game: season.BLK.toFixed(1),
          steals_per_game: season.STL.toFixed(1),
          fg_percentage: (season.FG_PCT * 100).toFixed(1),
          fg3_percentage: (season.FG3_PCT * 100).toFixed(1),
          ft_percentage: (season.FT_PCT * 100).toFixed(1),
        };
      } else {
        // For regular seasons, calculate averages
        const gamesPlayed = season.GP || 1;
        return {
          season: season.SEASON_ID,
          team: season.TEAM_ABBREVIATION || 'Unknown',
          games_played: season.GP,
          minutes_per_game: (season.MIN / gamesPlayed).toFixed(1),
          points_per_game: (season.PTS / gamesPlayed).toFixed(1),
          rebounds_per_game: (season.REB / gamesPlayed).toFixed(1),
          assists_per_game: (season.AST / gamesPlayed).toFixed(1),
          blocks_per_game: (season.BLK / gamesPlayed).toFixed(1),
          steals_per_game: (season.STL / gamesPlayed).toFixed(1),
          fg_percentage: (season.FG_PCT * 100).toFixed(1),
          fg3_percentage: (season.FG3_PCT * 100).toFixed(1),
          ft_percentage: (season.FT_PCT * 100).toFixed(1),
        };
      }
    });
  };

  const handleFetchStats = async () => {
    setError('');
    setStatsOne(null);
    setStatsTwo(null);
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
      {loading && <div className="loading-spinner"></div>}
      <div className="stats-container">
        <div className="player-stats">
          <h3>{playerOne}</h3>
          {statsOne ? (
            <table>
              <thead>
                <tr>
                  <th>Season</th>
                  <th>Team</th>
                  <th>GP</th>
                  <th>MPG</th>
                  <th>PPG</th>
                  <th>RPG</th>
                  <th>APG</th>
                  <th>BPG</th>
                  <th>SPG</th>
                  <th>FG%</th>
                  <th>3P%</th>
                  <th>FT%</th>
                </tr>
              </thead>
              <tbody>
                {statsOne.map((stat, index) => (
                  <tr key={index}>
                    <td>{stat.season}</td>
                    <td>{stat.team}</td>
                    <td>{stat.games_played}</td>
                    <td>{stat.minutes_per_game}</td>
                    <td>{stat.points_per_game}</td>
                    <td>{stat.rebounds_per_game}</td>
                    <td>{stat.assists_per_game}</td>
                    <td>{stat.blocks_per_game}</td>
                    <td>{stat.steals_per_game}</td>
                    <td>{stat.fg_percentage}%</td>
                    <td>{stat.fg3_percentage}%</td>
                    <td>{stat.ft_percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            !loading && <p>No stats available</p>
          )}
        </div>
        <div className="player-stats">
          <h3>{playerTwo}</h3>
          {statsTwo ? (
            <table>
              <thead>
                <tr>
                  <th>Season</th>
                  <th>Team</th>
                  <th>GP</th>
                  <th>MPG</th>
                  <th>PPG</th>
                  <th>RPG</th>
                  <th>APG</th>
                  <th>BPG</th>
                  <th>SPG</th>
                  <th>FG%</th>
                  <th>3P%</th>
                  <th>FT%</th>
                </tr>
              </thead>
              <tbody>
                {statsTwo.map((stat, index) => (
                  <tr key={index}>
                    <td>{stat.season}</td>
                    <td>{stat.team}</td>
                    <td>{stat.games_played}</td>
                    <td>{stat.minutes_per_game}</td>
                    <td>{stat.points_per_game}</td>
                    <td>{stat.rebounds_per_game}</td>
                    <td>{stat.assists_per_game}</td>
                    <td>{stat.blocks_per_game}</td>
                    <td>{stat.steals_per_game}</td>
                    <td>{stat.fg_percentage}%</td>
                    <td>{stat.fg3_percentage}%</td>
                    <td>{stat.ft_percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            !loading && <p>No stats available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Compare;