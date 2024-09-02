
import React from 'react';
import './Home.css';

function Home() {
  return (
    <div className="home-page">
      <header className="home-header">
        <h1>Welcome to the App</h1>
      </header>
      <main className="home-content">
        <p>
          Use the navigation links to explore different sections of the app,
          such as ranking players, viewing statistics, and more.
        </p>
      </main>
    </div>
  );
}

export default Home;