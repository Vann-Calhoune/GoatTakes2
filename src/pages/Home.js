import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';

function Home() {
  const [statLeaders, setStatLeaders] = useState({});
  const [standings, setStandings] = useState({ east: [], west: [] });
  const [error, setError] = useState(null);
  const statOrder = ['PTS', 'REB', 'AST', 'BLK', 'STL'];

  useEffect(() => {
    fetchStatLeaders();
    fetchStandings();
  }, []);

const fetchStatLeaders = async () => {
  try {
    const response = await axios.get('https://AnacondaLee.pythonanywhere.com/api/stat-leaders');
    if (response.data.error) {
      throw new Error(response.data.error);
    }
    setStatLeaders(response.data);
  } catch (error) {
    console.error('Error fetching stat leaders:', error);
    setError(error.message || 'Failed to fetch stat leaders. Please try again later.');
  }
};

function getStatFullName(stat) {
  const statNames = {
    'PTS': 'Points',
    'AST': 'Assists',
    'BLK': 'Blocks',
    'REB': 'Rebounds',
    'STL': 'Steals'
  };
  return statNames[stat] || stat;
}

  const fetchStandings = async () => {
    try {
      const response = await axios.get('https://AnacondaLee.pythonanywhere.com/api/standings');
      setStandings(response.data);
    } catch (error) {
      console.error('Error fetching standings:', error);
      setError(error.response?.data?.error || 'Failed to fetch standings');
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="home-page">
      <header className="home-header">
        <h1>Live NBA Stat Leaders and Standings</h1>
      </header>
      <main className="home-content">
      <section className="stat-leaders">
        <h2>Stat Leaders</h2>
        {statOrder.map((stat) => (
          <div key={stat} className="stat-category">
            <h3>{getStatFullName(stat)}</h3>
            <ol>
              {statLeaders[stat] && statLeaders[stat].map((player, index) => (
                <li key={index}>
                  {player.name} ({player.team}) - {player.value} {stat.toLowerCase()}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </section>
        <section className="standings">
          <h2>Standings</h2>
          <div className="conference-standings">
            <div className="east">
              <h3>Eastern Conference</h3>
              <ol>
                {standings.east.map((team, index) => (
                  <li key={index}>{team.name} - {team.wins}-{team.losses}</li>
                ))}
              </ol>
            </div>
            <div className="west">
              <h3>Western Conference</h3>
              <ol>
                {standings.west.map((team, index) => (
                  <li key={index}>{team.name} - {team.wins}-{team.losses}</li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;