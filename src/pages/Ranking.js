import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import PlayerList from '../components/PlayerList';
import RankingSettings from '../components/RankingSettings';
import RankingContainer from '../components/RankingContainer'; // Ensure this is imported
import './Ranking.css';

const nba75Players = [
  { id: '1', name: 'Kareem Abdul-Jabbar', img: '/images/playerIcons/kareem.png' },
  { id: '2', name: 'Ray Allen', img: '/images/playerIcons/ray.webp' },
  { id: '3', name: 'Giannis Antetokounmpo', img: '/images/playerIcons/giaHead.png' },
  { id: '4', name: 'Carmelo Anthony', img: '/images/playerIcons/melo.webp' },
  { id: '5', name: 'Nate Archibald', img: '/images/playerIcons/nate.webp' },
  { id: '6', name: 'Paul Arizin', img: '/images/playerIcons/arizin.webp' },
  { id: '7', name: 'Charles Barkley', img: '/images/playerIcons/barkley.webp' },
  { id: '8', name: 'Rick Barry', img: '/images/playerIcons/rickB.webp' },
  { id: '9', name: 'Elgin Baylor', img: '/images/playerIcons/elgin.webp' },
  { id: '10', name: 'Dave Bing', img: '/images/playerIcons/bing.webp' },
  { id: '11', name: 'Larry Bird', img: '/images/playerIcons/larry33.png' },
  { id: '12', name: 'Kobe Bryant', img: '/images/playerIcons/kobeHead.png' },
  { id: '13', name: 'Wilt Chamberlain', img: '/images/playerIcons/wilt.png' },
  { id: '14', name: 'Bob Cousy', img: '/images/playerIcons/cousy.webp' },
  { id: '15', name: 'Dave Cowens', img: '/images/playerIcons/cowens.webp' },
  { id: '16', name: 'Billy Cunningham', img: '/images/playerIcons/cunningham.webp' },
  { id: '17', name: 'Stephen Curry', img: '/images/playerIcons/stephHead.png' },
  { id: '18', name: 'Anthony Davis', img: '/images/playerIcons/aDavis.webp' },
  { id: '19', name: 'Dave DeBusschere', img: '/images/playerIcons/debusschere.webp' },
  { id: '20', name: 'Clyde Drexler', img: '/images/playerIcons/clyde.webp' },
  { id: '21', name: 'Tim Duncan', img: '/images/playerIcons/timHead.png' },
  { id: '22', name: 'Kevin Durant', img: '/images/playerIcons/kevinHead.png' },
  { id: '23', name: 'Julius Erving', img: '/images/playerIcons/erving.webp' },
  { id: '24', name: 'Patrick Ewing', img: '/images/playerIcons/ewing.webp' },
  { id: '25', name: 'Walt Frazier', img: '/images/playerIcons/frazier.webp' },
  { id: '26', name: 'Kevin Garnett', img: '/images/playerIcons/kg.webp' },
  { id: '27', name: 'George Gervin', img: '/images/playerIcons/gervin.webp' },
  { id: '28', name: 'Hal Greer', img: '/images/playerIcons/hal.webp' },
  { id: '29', name: 'James Harden', img: '/images/playerIcons/harden.webp' },
  { id: '30', name: 'John Havlicek', img: '/images/playerIcons/havlicek.webp' },
  { id: '31', name: 'Elvin Hayes', img: '/images/playerIcons/elvin.webp' },
  { id: '32', name: 'LeBron James', img: '/images/playerIcons/lebronHead.png' },
  { id: '33', name: 'Magic Johnson', img: '/images/playerIcons/magicHead.png' },
  { id: '34', name: 'Sam Jones', img: '/images/playerIcons/samJ.webp' },
  { id: '35', name: 'Michael Jordan', img: '/images/playerIcons/mjHeads.png' },
  { id: '36', name: 'Jason Kidd', img: '/images/playerIcons/jKidd.png' },
  { id: '37', name: 'Allen Iverson', img: '/images/playerIcons/allen.webp' },
  { id: '38', name: 'Kawhi Leonard', img: '/images/playerIcons/kawhi.webp' },
  { id: '39', name: 'Damian Lillard', img: '/images/playerIcons/lillard.webp' },
  { id: '40', name: 'Jerry Lucas', img: '/images/playerIcons/lucas.webp' },
  { id: '41', name: 'Karl Malone', img: '/images/playerIcons/malone.webp' },
  { id: '42', name: 'Moses Malone', img: '/images/playerIcons/moses.webp' },
  { id: '43', name: 'Pete Maravich', img: '/images/playerIcons/pistol.webp' },
  { id: '44', name: 'Bob McAdoo', img: '/images/playerIcons/mcadoo.webp' },
  { id: '45', name: 'Kevin McHale', img: '/images/playerIcons/mchale.webp' },
  { id: '46', name: 'George Mikan', img: '/images/playerIcons/mikan.webp' },
  { id: '47', name: 'Reggie Miller', img: '/images/playerIcons/reggie.webp' },
  { id: '48', name: 'Earl Monroe', img: '/images/playerIcons/pearl.webp' },
  { id: '49', name: 'Steve Nash', img: '/images/playerIcons/nash.png' },
  { id: '50', name: 'Dirk Nowitzki', img: '/images/playerIcons/dirk.webp' },
  { id: '51', name: 'Shaquille O’Neal', img: '/images/playerIcons/shaq.webp' },
  { id: '52', name: 'Hakeem Olajuwon', img: '/images/playerIcons/hakeem.webp' },
  { id: '53', name: 'Robert Parish', img: '/images/playerIcons/parish.webp' },
  { id: '54', name: 'Chris Paul', img: '/images/playerIcons/cp3.webp' },
  { id: '55', name: 'Gary Payton', img: '/images/playerIcons/gp.webp' },
  { id: '56', name: 'Bob Pettit', img: '/images/playerIcons/pettit.webp' },
  { id: '57', name: 'Paul Pierce', img: '/images/playerIcons/pierce.webp' },
  { id: '58', name: 'Scottie Pippen', img: '/images/playerIcons/pippen.webp' },
  { id: '59', name: 'Willis Reed', img: '/images/playerIcons/willis.webp' },
  { id: '60', name: 'Oscar Robertson', img: '/images/playerIcons/oscar.webp' },
  { id: '61', name: 'David Robinson', img: '/images/playerIcons/drob.webp' },
  { id: '62', name: 'Dennis Rodman', img: '/images/playerIcons/rodman.webp' },
  { id: '63', name: 'Bill Russell', img: '/images/playerIcons/bruss.webp' },
  { id: '64', name: 'Dolph Schayes', img: '/images/playerIcons/dolph.webp' },
  { id: '65', name: 'Bill Sharman', img: '/images/playerIcons/sharman.webp' },
  { id: '66', name: 'John Stockton', img: '/images/playerIcons/stockton.webp' },
  { id: '67', name: 'Isiah Thomas', img: '/images/playerIcons/it.webp' },
  { id: '68', name: 'Nate Thurmond', img: '/images/playerIcons/thurmond.webp' },
  { id: '69', name: 'Wes Unseld', img: '/images/playerIcons/wes.webp' },
  { id: '70', name: 'Dwyane Wade', img: '/images/playerIcons/wadeHead.png' },
  { id: '71', name: 'Bill Walton', img: '/images/playerIcons/walton.webp' },
  { id: '72', name: 'Jerry West', img: '/images/playerIcons/west.webp' },
  { id: '73', name: 'Russell Westbrook', img: '/images/playerIcons/westbrookHead.webp' },
  { id: '74', name: 'Lenny Wilkens', img: '/images/playerIcons/lenny.webp' },
  { id: '75', name: 'Dominique Wilkins', img: '/images/playerIcons/wilkins.webp' },
  { id: '76', name: 'James Worthy', img: '/images/playerIcons/worthy.png' }
];

function Ranking() {
  const [players, setPlayers] = useState(nba75Players);
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
                <RankingContainer
                  ref={provided.innerRef}
                  rankingSettings={{ startNumber, order }}
                  rankedPlayers={rankedPlayers
                    .slice()
                    .sort((a, b) =>
                      order === 'ascending'
                        ? a.index - b.index
                        : b.index - a.index
                    )}
                  providedPlaceholder={provided.placeholder}
                />
              )}
            </Droppable>
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}

export default Ranking;