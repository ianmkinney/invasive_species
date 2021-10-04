from pyinaturalist import *
import json 
import pandas as pd
from datetime import datetime
from dateutil.relativedelta import *
from sqlalchemy import create_engine
from connection_string import connection_string

def create_db(months_back):
    currentMonth = datetime.now().month
    currentYear = datetime.now().year
    startDate = datetime.now() - relativedelta(months=months_back)
    startMonth = startDate.month
    startYear = startDate.year

    dfs = []
    
    if(startYear == currentYear):
        i = currentMonth
        while(i != (startMonth-1)):
            observationsIntro = get_observations(place_id=23, per_page=200, introduced=True, quality_grade='research', month=i, year=startYear)
            observationsNative = get_observations(place_id=23, per_page=200, native=True, quality_grade='research', month=i, year=startYear)
            observationsThreat = get_observations(place_id=23, per_page=200, threatened=True, quality_grade='research', month=i, year=startYear)
            dfIntro = pd.DataFrame(observationsIntro['results'])
            dfNative = pd.DataFrame(observationsNative['results'])
            dfThreat = pd.DataFrame(observationsThreat['results'])
            dfIntro['category'] = 'Introduced'
            dfNative['category'] = 'Native'
            dfThreat['category'] = 'Threatened'
            dfs.append(dfIntro)
            dfs.append(dfNative)
            dfs.append(dfThreat)
            i = i-1
    else:
        print("Query too large!")
        return
    
    # Add new fields from dictionaries within data
    for df in dfs:
        df['iconic_taxon_name'] = ""
        df['name'] = ""
        df['preferred_common_name'] = ""
        df['wikipedia_url'] = ""
        i = 0
        for dict in df['taxon']:
            if 'iconic_taxon_name' in dict:
                df.at[i,'iconic_taxon_name'] = dict['iconic_taxon_name']
            if 'name' in dict:
                df.at[i,'name'] = dict["name"]
            if 'preferred_common_name' in dict:
                df.at[i, 'preferred_common_name'] = dict['preferred_common_name']
            if 'wikipedia_url' in dict:
                df.at[i, 'wikipedia_url'] = dict['wikipedia_url']
            i = i+1

    print("API Calls Completed")

    # Create simplified dataframes to upload to database
    updated_dfs = []
    for df in dfs:
        new_df = df[['time_observed_at', 'species_guess', 'place_guess', 'location', 'iconic_taxon_name', 'name', 'preferred_common_name', 'wikipedia_url', 'category']]
        updated_dfs.append(new_df)


    # Upload to database
    db = create_engine(connection_string)

    conn = db.connect()

    updated_dfs[0].to_sql('observations', con=conn, if_exists='replace')

    for df in updated_dfs[1:]:
        df.to_sql('observations', con=conn, if_exists='append')

    print("Uploaded to Database")

    conn.close()

    return

create_db(4)

