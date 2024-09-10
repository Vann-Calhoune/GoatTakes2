from flask import Flask, request, jsonify
from flask_cors import CORS
from nba_api.stats.endpoints import playercareerstats, leagueleaders, leaguestandings
from nba_api.stats.static import players
import time

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "https://goattakes2.netlify.app/"}})

# Cache for stat leaders and standings
cache = {
    'stat_leaders': {'data': None, 'timestamp': 0},
    'standings': {'data': None, 'timestamp': 0}
}
CACHE_DURATION = 3600  # 1 hour

def get_player_id(player_name):
    player_dict = players.get_players()
    player = [player for player in player_dict if player['full_name'].lower() == player_name.lower()]
    return player[0]['id'] if player else None

def get_career_stats(player_id):
    try:
        career = playercareerstats.PlayerCareerStats(player_id=player_id)
        season_totals = career.get_data_frames()[0]  # SeasonTotalsRegularSeason
        career_totals = career.get_data_frames()[1]  # CareerTotalsRegularSeason

        # Convert season totals to records
        season_totals_records = season_totals.to_dict(orient='records')

        # Get career totals
        career_totals_record = career_totals.to_dict(orient='records')[0]

        # Calculate career averages
        games_played = career_totals_record['GP'] if career_totals_record['GP'] != 0 else 1
        career_averages = {
            'SEASON_ID': 'Career',
            'TEAM_ABBREVIATION': 'All',
            'GP': career_totals_record['GP'],
            'MIN': round(career_totals_record['MIN'] / games_played, 1),
            'FGM': round(career_totals_record['FGM'] / games_played, 1),
            'FGA': round(career_totals_record['FGA'] / games_played, 1),
            'FG_PCT': career_totals_record['FG_PCT'],
            'FG3M': round(career_totals_record['FG3M'] / games_played, 1),
            'FG3A': round(career_totals_record['FG3A'] / games_played, 1),
            'FG3_PCT': career_totals_record['FG3_PCT'],
            'FTM': round(career_totals_record['FTM'] / games_played, 1),
            'FTA': round(career_totals_record['FTA'] / games_played, 1),
            'FT_PCT': career_totals_record['FT_PCT'],
            'OREB': round(career_totals_record['OREB'] / games_played, 1),
            'DREB': round(career_totals_record['DREB'] / games_played, 1),
            'REB': round(career_totals_record['REB'] / games_played, 1),
            'AST': round(career_totals_record['AST'] / games_played, 1),
            'STL': round(career_totals_record['STL'] / games_played, 1),
            'BLK': round(career_totals_record['BLK'] / games_played, 1),
            'TOV': round(career_totals_record['TOV'] / games_played, 1),
            'PF': round(career_totals_record['PF'] / games_played, 1),
            'PTS': round(career_totals_record['PTS'] / games_played, 1)
        }

        season_totals_records.append(career_averages)
        return season_totals_records
    except ImportError:
        # If pandas is not available, return an error message
        return [{'error': 'Pandas is not installed. Unable to process player stats.'}]
    except Exception as e:
        # Log the specific error for debugging
        app.logger.error(f"Error in get_career_stats: {str(e)}")
        return [{'error': f'Failed to fetch player stats: {str(e)}'}]

@app.route('/api/player-stats', methods=['GET'])
def player_stats():
    player_name = request.args.get('name')
    if not player_name:
        return jsonify({'error': 'Player name is required'}), 400

    try:
        player_id = get_player_id(player_name)
        if not player_id:
            return jsonify({'error': f'Player not found: {player_name}'}), 404

        stats = get_career_stats(player_id)
        if isinstance(stats, list) and stats and 'error' in stats[0]:
            return jsonify(stats[0]), 500
        return jsonify(stats)
    except Exception as e:
        app.logger.error(f"Error fetching stats for {player_name}: {str(e)}")
        return jsonify({'error': f"Failed to fetch stats for {player_name}: {str(e)}"}), 500
@app.route('/api/stat-leaders')
def get_stat_leaders():
    if cache['stat_leaders']['data'] and time.time() - cache['stat_leaders']['timestamp'] < CACHE_DURATION:
        return jsonify(cache['stat_leaders']['data'])

    stats = ['PTS', 'AST', 'BLK', 'REB', 'STL']
    leaders = {}

    try:
        for stat in stats:
            leader_data = leagueleaders.LeagueLeaders(stat_category_abbreviation=stat, per_mode48='Totals').get_dict()
            if 'resultSet' not in leader_data:
                raise KeyError(f"'resultSet' not found in leader_data for {stat}")
            result_set = leader_data['resultSet']
            if 'rowSet' not in result_set:
                raise KeyError(f"'rowSet' not found in result_set for {stat}")

            leaders[stat] = []
            for player in result_set['rowSet'][:5]:
                games_played = player[5]  # GP is at index 5

                # Use different indices for each stat
                if stat == 'PTS':
                    total_stat = player[-4]
                elif stat == 'REB':
                    total_stat = player[-10]
                elif stat == 'AST':
                    total_stat = player[-9]
                elif stat == 'BLK':
                    total_stat = player[-7]
                elif stat == 'STL':
                    total_stat = player[-8]

                avg_stat = round(total_stat / games_played, 1) if games_played > 0 else 0

                leaders[stat].append({
                    'name': player[2],  # PLAYER
                    'team': player[4],  # TEAM
                    'value': avg_stat,
                    'stat': stat
                })

        cache['stat_leaders'] = {'data': leaders, 'timestamp': time.time()}
        return jsonify(leaders)
    except Exception as e:
        app.logger.error(f"Error fetching stat leaders: {str(e)}")
        return jsonify({'error': f"Failed to fetch stat leaders: {str(e)}"}), 500

@app.route('/api/standings')
def get_standings():
    if cache['standings']['data'] and time.time() - cache['standings']['timestamp'] < CACHE_DURATION:
        return jsonify(cache['standings']['data'])

    try:
        standings_data = leaguestandings.LeagueStandings().get_dict()
        if 'resultSets' not in standings_data:
            raise KeyError("'resultSets' not found in standings_data")
        result_set = standings_data['resultSets'][0]  # Assuming the first result set contains the standings
        if 'rowSet' not in result_set:
            raise KeyError("'rowSet' not found in result_set")

        east = []
        west = []
        unknown = []

        for team in result_set['rowSet']:
            team_info = {
                'name': team[4] if team[4] is not None else 'Unknown',  # TEAM
                'wins': int(team[12]) if team[12] is not None else 0,  # W
                'losses': int(team[13]) if team[13] is not None else 0,  # L
                'winPercentage': float(team[14]) if team[14] is not None else 0.0,  # W_PCT
                'gamesBehind': float(team[15]) if team[15] is not None and team[15] != '-' else 0.0,  # GB
            }

            # Use a dictionary to map team names to conferences
            team_conferences = {
                'Celtics': 'East', 'Nets': 'East', 'Knicks': 'East', '76ers': 'East', 'Raptors': 'East',
                'Bulls': 'East', 'Cavaliers': 'East', 'Pistons': 'East', 'Pacers': 'East', 'Bucks': 'East',
                'Hawks': 'East', 'Hornets': 'East', 'Heat': 'East', 'Magic': 'East', 'Wizards': 'East',
                'Nuggets': 'West', 'Timberwolves': 'West', 'Thunder': 'West', 'Trail Blazers': 'West', 'Jazz': 'West',
                'Warriors': 'West', 'Clippers': 'West', 'Lakers': 'West', 'Suns': 'West', 'Kings': 'West',
                'Mavericks': 'West', 'Rockets': 'West', 'Grizzlies': 'West', 'Pelicans': 'West', 'Spurs': 'West'
            }

            conference = team_conferences.get(team_info['name'], 'Unknown')

            if conference == 'East':
                east.append(team_info)
            elif conference == 'West':
                west.append(team_info)
            else:
                unknown.append(team_info)
                app.logger.warning(f"Unknown conference for team: {team_info['name']}")

        # Sort teams by win percentage
        east.sort(key=lambda x: x['winPercentage'], reverse=True)
        west.sort(key=lambda x: x['winPercentage'], reverse=True)

        standings = {'east': east, 'west': west, 'unknown': unknown}
        cache['standings'] = {'data': standings, 'timestamp': time.time()}
        return jsonify(standings)
    except Exception as e:
        app.logger.error(f"Error fetching standings: {str(e)}")
        return jsonify({'error': f"Failed to fetch standings: {str(e)}"}), 500

if __name__ == '__main__':
    app.run()