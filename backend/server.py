from flask import Flask, request, jsonify
from flask_cors import CORS
from nba_api.stats.endpoints import playercareerstats
from nba_api.stats.static import players

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

def get_player_id(player_name):
    player_dict = players.get_players()
    player = [player for player in player_dict if player['full_name'].lower() == player_name.lower()]
    if player:
        return player[0]['id']
    return None

def get_career_stats(player_id):
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