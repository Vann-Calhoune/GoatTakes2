from flask import Flask, request, jsonify
from flask_cors import CORS
from nba_api.stats.endpoints import playercareerstats
from nba_api.stats.static import players

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})  # Allow requests from React frontend

def get_player_id(player_name):
    player_dict = players.get_players()
    player = [player for player in player_dict if player['full_name'].lower() == player_name.lower()]
    if player:
        return player[0]['id']
    return None

def get_career_stats(player_id):
    career = playercareerstats.PlayerCareerStats(player_id=player_id)
    data = career.get_data_frames()[0]  # Get the dataframe of the career stats
    # Rename columns for simplicity
    data.columns = ['PLAYER_ID', 'SEASON_ID', 'LEAGUE_ID', 'TEAM_ID', 'TEAM_ABBREVIATION', 'PLAYER_AGE', 'GP', 'GS', 'MIN',
                    'FGM', 'FGA', 'FG_PCT', 'FG3M', 'FG3A', 'FG3_PCT', 'FTM', 'FTA', 'FT_PCT', 'OREB', 'DREB',
                    'REB', 'AST', 'STL', 'BLK', 'TOV', 'PF', 'PTS']
    return data.to_dict(orient='records')  # Convert dataframe to a list of dictionaries

@app.route('/api/player-stats', methods=['GET'])
def player_stats():
    player_name = request.args.get('name')
    if not player_name:
        return jsonify({'error': 'Player name is required'}), 400

    player_id = get_player_id(player_name)
    if not player_id:
        return jsonify({'error': 'Player not found'}), 404

    try:
        stats = get_career_stats(player_id)
        return jsonify(stats)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)