import React from 'react';
import './Header.css';
const Header = () => {
  return (
    <header className="header">
      <h1>Goat Takes</h1>
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/75">75</a></li>
          <li><a href="/compare">Compare</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;