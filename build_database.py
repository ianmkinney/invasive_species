from pyinaturalist import *
import json 
import pandas as pd
import time
from sqlalchemy import create_engine
from connection_string import connection_string

# Bounding Box for Georgia, USA
# [South Latitude, North Latitude, West Longitude, East Longitude]
# [-85.606749,30.359092,-80.843756,35.000591]

observationsSep = get_observations(place_id=23, per_page=200, introduced=True, quality_grade='research', month=9)
observationsAug = get_observations(place_id=23, per_page=200, introduced=True, quality_grade='research', month=8)
observationsJul = get_observations(place_id=23, per_page=200, introduced=True, quality_grade='research', month=7)
observationsJun = get_observations(place_id=23, per_page=200, introduced=True, quality_grade='research', month=6)
observationsMay = get_observations(place_id=23, per_page=200, introduced=True, quality_grade='research', month=5)

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

print("API calls completed")

updated_dfs = []
for df in dfs:
    new_df = df[['time_observed_at', 'species_guess', 'place_guess', 'location']]
    updated_dfs.append(new_df)

db = create_engine(connection_string)

conn = db.connect()

updated_dfs[0].to_sql('observations', con=conn, if_exists='replace')

for df in updated_dfs[1:]:
    df.to_sql('observations', con=conn, if_exists='append')

print("Uploaded to Database")

conn.close()

