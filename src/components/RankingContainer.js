import React from 'react';
import { Draggable } from '@hello-pangea/dnd';

const RankingContainer = React.forwardRef(({ rankedPlayers, rankingSettings, providedPlaceholder, ...props }, ref) => {
  return (
    <div ref={ref} className="droppable-container" {...props}>
      <h2>Ranked Players</h2>
      <div className="player-list">
        {rankedPlayers.map((player, index) => (
          <Draggable key={player.id} draggableId={player.id} index={index}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className="player-item"
              >
                <span className="rank-number">
                  {rankingSettings.order === 'descending'
                    ? rankingSettings.startNumber - index
                    : rankingSettings.startNumber + index}
                </span>
                <img src={player.img} alt={player.name} className="player-img" />
                <span>{player.name}</span>
              </div>
            )}
          </Draggable>
        ))}
        {providedPlaceholder}
      </div>
    </div>
  );
});

export default RankingContainer;