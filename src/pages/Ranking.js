import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import PlayerList from '../components/PlayerList';
import RankingSettings from '../components/RankingSettings';
import './Ranking.css';

const initialPlayers = [
  { id: '1', name: 'Player 1', img: '/logo192.png' },
  { id: '2', name: 'Player 2', img: '/logo192.png' },
  { id: '3', name: 'Player 3', img: '/logo192.png' },
];

function Ranking() {
  const [players, setPlayers] = useState(initialPlayers);
  const [rankedPlayers, setRankedPlayers] = useState([]);
  const [search, setSearch] = useState('');
  const [startNumber, setStartNumber] = useState(1);
  const [order, setOrder] = useState('ascending');

  const filteredPlayers = players.filter((player) =>
    player.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    let sourceList, setSourceList, destinationList, setDestinationList;

    if (source.droppableId === 'players') {
      sourceList = players;
      setSourceList = setPlayers;
    } else {
      sourceList = rankedPlayers;
      setSourceList = setRankedPlayers;
    }

    if (destination.droppableId === 'players') {
      destinationList = players;
      setDestinationList = setPlayers;
    } else {
      destinationList = rankedPlayers;
      setDestinationList = setRankedPlayers;
    }

    const [movedItem] = sourceList.splice(source.index, 1);
    destinationList.splice(destination.index, 0, movedItem);

    setSourceList([...sourceList]);
    setDestinationList([...destinationList]);
  };

  return (
    <div className="ranking-page">
      <h1>Ranking Page</h1>

      <RankingSettings
        startNumber={startNumber}
        order={order}
        onStartNumberChange={setStartNumber}
        onOrderChange={setOrder}
      />

      <div className="players-container">
        <input
          type="text"
          placeholder="Search players..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="containers">
            <Droppable droppableId="players">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="droppable-container"
                >
                  <h2>Players</h2>
                  <PlayerList players={filteredPlayers} />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            <Droppable droppableId="rankedPlayers">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="droppable-container"
                >
                  <h2>Ranked Players</h2>
                  <div className="player-list">
                    {rankedPlayers
                      .slice()
                      .sort((a, b) =>
                        order === 'ascending'
                          ? a.index - b.index
                          : b.index - a.index
                      )
                      .map((player, index) => (
                        <Draggable
                          key={player.id}
                          draggableId={player.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="player-item"
                            >
                              <span className="rank-number">
                                {order === 'ascending' ? startNumber + index : startNumber + rankedPlayers.length - 1 - index}
                              </span>
                              <img
                                src={player.img}
                                alt={player.name}
                                className="player-img"
                              />
                              <span>{player.name}</span>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}

export default Ranking;