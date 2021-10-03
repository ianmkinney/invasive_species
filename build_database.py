from pyinaturalist import *
import json 
import pandas as pd
import time
from sqlalchemy import create_engine
from connection_string import connection_string

# Paerform API Calls
observationsSep = get_observations(place_id=23, per_page=200, introduced=True, quality_grade='research', month=9)
observationsAug = get_observations(place_id=23, per_page=200, introduced=True, quality_grade='research', month=8)
observationsJul = get_observations(place_id=23, per_page=200, introduced=True, quality_grade='research', month=7)
observationsJun = get_observations(place_id=23, per_page=200, introduced=True, quality_grade='research', month=6)
observationsMay = get_observations(place_id=23, per_page=200, introduced=True, quality_grade='research', month=5)

# Create array of dataframs from api jsons
dfs = []

dfSep = pd.DataFrame(observationsSep['results'])
dfs.append(dfSep)
dfAug = pd.DataFrame(observationsAug['results'])
dfs.append(dfAug)
dfJul = pd.DataFrame(observationsJul['results'])
dfs.append(dfJul)
dfJun = pd.DataFrame(observationsJun['results'])
dfs.append(dfJun)
dfMay = pd.DataFrame(observationsMay['results'])
dfs.append(dfMay)

# Add new fields from dictionaries within data
for df in dfs:
    df['iconic_taxon_name'] = ""
    df['name'] = ""
    df['preferred_common_name'] = ""
    df['wikipedia_url'] = ""
    i = 0
    for dict in df['taxon']:
        df.at[i,'iconic_taxon_name'] = dict['iconic_taxon_name']
        df.at[i,'name'] = dict["name"]
        if 'preferred_common_name' in dict:
            df.at[i, 'preferred_common_name'] = dict['preferred_common_name']
        if 'wikipedia_url' in dict:
            df.at[i, 'wikipedia_url'] = dict['wikipedia_url']

        i = i+1

print("API calls completed")

# Create simplified dataframes to upload to database
updated_dfs = []
for df in dfs:
    new_df = df[['time_observed_at', 'species_guess', 'place_guess', 'location', 'iconic_taxon_name', 'name', 'preferred_common_name', 'wikipedia_url']]
    updated_dfs.append(new_df)


# Upload to database
db = create_engine(connection_string)

conn = db.connect()

updated_dfs[0].to_sql('observations', con=conn, if_exists='replace')

for df in updated_dfs[1:]:
    df.to_sql('observations', con=conn, if_exists='append')

print("Uploaded to Database")

conn.close()

