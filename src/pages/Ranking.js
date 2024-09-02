import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
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

  // Filter players based on search input
  const filteredPlayers = players.filter((player) =>
    player.name.toLowerCase().includes(search.toLowerCase())
  );

  // Function to handle drag end event
  const handleDragEnd = (result) => {
    const { source, destination } = result;

    // If no destination, exit
    if (!destination) return;

    // If the player is dragged within the same container and position doesn't change, exit
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    // Copy of player arrays
    let sourceList, setSourceList, destinationList, setDestinationList;

    // Define which lists are being interacted with based on droppable IDs
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

    // Clone items from both source and destination
    const [movedItem] = sourceList.splice(source.index, 1);

    // Insert the moved item into the destination list
    destinationList.splice(destination.index, 0, movedItem);

    // Update the state of both lists
    setSourceList([...sourceList]);
    setDestinationList([...destinationList]);
  };

  return (
    <div className="ranking-page">
      <h1>Ranking Page</h1>

      {/* Search input */}
      <input
        type="text"
        placeholder="Search players..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      {/* DragDropContext to handle the dragging and dropping */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="containers">
          {/* Droppable for unranked players */}
          <Droppable droppableId="players">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="droppable-container"
              >
                <h2>Players</h2>
                <div className="player-list">
                  {filteredPlayers.map((player, index) => (
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

          {/* Droppable for ranked players */}
          <Droppable droppableId="rankedPlayers">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="droppable-container"
              >
                <h2>Ranked Players</h2>
                <div className="player-list">
                  {rankedPlayers.map((player, index) => (
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
  );
}

export default Ranking;