import './App.css';
import React from 'react';
import Header from './components/Header';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Ranking from './pages/Ranking';

function App() {
  return (
    <div className="App">
      <Header />
      <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/75" element={<Ranking />} />
            </Routes>
          </Router>
    </div>
  );
}

export default App;