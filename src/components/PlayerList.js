import React from 'react';
import { Draggable } from '@hello-pangea/dnd';

const PlayerList = ({ players }) => {
  return (
    <div className="player-list">
      {players.map((player, index) => (
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
    </div>
  );
};

export default PlayerList;