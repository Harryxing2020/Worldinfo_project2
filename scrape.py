import pandas as pd
import requests
import pymongo
import requests
import sqlite3, matplotlib
from sqlalchemy import create_engine
# def init_browser():
    # @NOTE: Replace the path with your actual path to the chromedriver
    # executable_path = {'executable_path': ChromeDriverManager().install()}
    # return Browser("chrome", **executable_path, headless=False)

def scrapeData():
    #inital the connection to chrome browser
    # browser = init_browser()
    # Read the GDP per capita data from wikipedia
    tables = pd.read_html('https://en.wikipedia.org/wiki/List_of_countries_by_GDP_%28PPP%29_per_capita')
    # get exact data from table
    gdp_per_capita = tables[2]
    # clean data and rename the columns 
    gdp_per_capita_df = gdp_per_capita.loc[gdp_per_capita.loc[:,'Rank']!= '—']
    gdp_per_capita_df.columns = ['rank', 'country', 'gdp_per_capita']
    gdp_per_capita_df = gdp_per_capita_df.iloc[:,1:3]
    gdp_per_capita_clean_df = gdp_per_capita_df.reset_index(drop=True)


    # Read the population from wikipedia
    tables = pd.read_html('https://worldpopulationreview.com/countries')
    # get exact data from table
    country_population_df = tables[0]

    # clean data and rename the columns 
    country_population_df.columns = ['rank', 'country', 'population', 'population2', 'growthrate', 'countrysize', 'pop_den']
    country_population_clean_df = country_population_df.loc[:,['country', 'population', 'growthrate', 'countrysize', 'pop_den']]
    country_population_clean_df.loc[:,'pop_den']= country_population_clean_df.loc[:,'pop_den'].str[:-4]
    country_population_clean_df.loc[:,'growthrate'] = country_population_clean_df.loc[:,'growthrate'].str[:-1]
    country_population_clean_df.loc[:,'growthrate']=country_population_clean_df.loc[:,'growthrate'].astype(float)/100
    country_population_clean_df['pop_den'] = country_population_clean_df['pop_den'].str.replace(',','')
    country_population_clean_df.loc[:,'pop_den']=country_population_clean_df.loc[:,'pop_den'].astype(int)
    gdp_per_capita_clean_df.iloc[28, 0] = 'South Korea'

    # Read the Happiness data from wikipedia
    tables = pd.read_html('https://en.wikipedia.org/wiki/World_Happiness_Report#2019_World_Happiness_Report')
    
    # get exact data from table
    country_happiest_df = tables[4]
    # clean data and rename the columns 
    country_happiest_df = country_happiest_df.loc[:, ['Country or region','Score']]
    country_happiest_df.columns = ['country', 'happiestScore']
    country_happiest_df.loc[country_happiest_df.loc[:, "country"] == 'United States of America']
    country_happiest_df.iloc[18,0] = 'United States'



    # merging four dataframes 
    # merging three dataframes 
    populcation_data = pd.merge(country_happiest_df, country_population_clean_df, 
                how="left", 
                on = ["country","country"])
    populcation_data = pd.merge(populcation_data, gdp_per_capita_clean_df , 
                how="left", 
                on = ["country","country"])

    # drop empty field 
    populcation_data = populcation_data.dropna()

    # create json list
    engine = create_engine('sqlite:///db/worldinfo.sqlite', echo=False)
    sqlite_connection = engine.connect()
    sqlite_table = "worldinfo"
    populcation_data.to_sql(sqlite_table, sqlite_connection, if_exists='replace')




