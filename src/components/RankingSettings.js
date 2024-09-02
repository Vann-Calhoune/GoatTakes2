import React from 'react';

const RankingSettings = ({ startNumber, order, onStartNumberChange, onOrderChange }) => {
  return (
    <div className="ranking-settings">
      <label htmlFor="start-number">Start Number: </label>
      <input
        type="number"
        id="start-number"
        value={startNumber}
        onChange={(e) => onStartNumberChange(Number(e.target.value))}
        min="1"
      />

      <label htmlFor="order">Order: </label>
      <select
        id="order"
        value={order}
        onChange={(e) => onOrderChange(e.target.value)}
      >
        <option value="ascending">Ascending</option>
        <option value="descending">Descending</option>
      </select>
    </div>
  );
};

export default RankingSettings;