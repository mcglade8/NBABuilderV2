import numpy as np
import requests as req
import pandas as pd
from nba_api.stats.endpoints import playercareerstats as nba
from nba_api.stats.endpoints import scoreboard
from nba_api.stats.endpoints import boxscoretraditionalv2 as boxscores
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split

# run this to scrape the data from the NBA API which can be directly accessed by nbascript.js
# if scripts not allowed in terminal: Set-ExecutionPolicy Unrestricted -Scope Process
# to activate venv in terminal: tutorial_env/Scripts/Activate.ps1
# to deactivate venv in terminal: deactivate


# get box scores for the last game each team played prior to today
def get_box_scores():
    testing = False
    days = 15

    if not testing:
        # get the scoreboard for yesterday's games
        s = scoreboard.Scoreboard(day_offset=-1)
        s = s.get_data_frames()[0]

        # # get unique list of game ids and team abbreviations
        # game_ids = s[['GAME_ID', 'TEAM_ABBREVIATION']].unique()

        # # add a column for opponent's team abbreviation
        # s['OPP_TEAM_ABBREVIATION'] = ''

        # # for each item in s, add the opponent's team abbreviation based on game_ids
        # for i in range(len(s)):
        #     if s['TEAM_ABBREVIATION'][i] == game_ids[i][1]:
        #         s['OPP_TEAM_ABBREVIATION'][i] = game_ids[i][1]
        #     else:
        #         s['OPP_TEAM_ABBREVIATION'][i] = game_ids[i][0]

        

        # get the scoreboard for the last 15 days of games
        for i in range(2, days):
            s = pd.concat([s, scoreboard.Scoreboard(day_offset=-i).get_data_frames()[0]])

        # filter for games that were played
        player_stats = []
        for game in s['GAME_ID']:
            p = boxscores.BoxScoreTraditionalV2(game).get_data_frames()[0]
            player_stats.append(p[p['MIN'].notnull()])
            
        # combine player_stats into one dataframe
        sb = pd.concat(player_stats)

        # save scrape as .csv
        sb.to_csv('player_stats.csv')
    
    else: 
        sb = pd.read_csv('player_stats.csv')

    # calculate fantasy points for each record
    sb['FPTS'] = sb['PTS'] + sb['REB']*1.2 + sb['AST']*1.5 + sb['STL']*3 + sb['BLK']*3 - sb['TO'] + sb['FG3M']*0.5

    # calculate team fantasy points per game
    t1 = sb.groupby(['TEAM_ABBREVIATION', 'GAME_ID']).sum(numeric_only=True).groupby('TEAM_ABBREVIATION').mean(numeric_only=True).reset_index()
    
    # get a unique team id for each team
    teamandid = sb[['TEAM_ABBREVIATION', 'TEAM_ID']]
    teamandid = teamandid.drop_duplicates(subset=['TEAM_ABBREVIATION'])

    # get the average fantasy points per game for each team
    t1 = t1[['TEAM_ABBREVIATION', 'FPTS']]
    t1.columns = ['TEAM_ABBREVIATION', 'TEAM_FPTS_AVG']
    
    # merge team fantasy points per game with scoreboard
    sb = pd.merge(sb, t1, on='TEAM_ABBREVIATION')

    # convert sb['MIN'] to int by removing ':'
    sb['MIN'] = sb['MIN'].str.replace(':', '').astype(float)

    # calculate the percent of team average fantasy points each player scored
    sb['FPTS_PCT_OF_TEAM'] = sb['FPTS']/sb['TEAM_FPTS_AVG']

    # get players' averages
    #sb = sb.groupby('PLAYER_NAME').mean(numeric_only=True).reset_index()

    # get exponential moving average of players' stats; remove all but the last record for each player
    #sb = sb.groupby('PLAYER_NAME').ewm(span=days).mean(numeric_only = True).reset_index()
    sb = sb.groupby('PLAYER_NAME').mean(numeric_only=True).reset_index()
    #sb = sb.drop_duplicates(subset=['PLAYER_NAME'], keep='last')

    # merge with teamandid by team_id
    sb = pd.merge(sb, teamandid, on='TEAM_ID')

    # make the player names the index
    sb = sb.set_index('PLAYER_NAME')
    #print(sb)

    # print to json
    sb.to_json('player_stats.json', orient='index')




get_box_scores()

# get the player stats for the last game each team played prior to today
# export as .json file
# def get_player_stats_json():
#     # get the box scores for yesterday's games
#     box_scores = get_box_scores()

#     # get the player stats for yesterday's games
#     player_stats = []
#     for game in box_scores['GAME_ID']:
#         player_stats.append(boxscores.BoxScoreTraditionalV2(game).get_data_frames()[0])
        
#     # combine player_stats into one dataframe
#     player_stats = pd.concat(player_stats)

#     # print the player stats as .json
#     player_stats.to_json('player_stats.json', orient='records')

