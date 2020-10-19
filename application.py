from sqlalchemy import create_engine
import pandas as pd
from flask import Flask, jsonify, render_template

application = app = Flask(__name__)
#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///db/worldinfo.sqlite")

conn = engine.connect()

worldinfoDF = pd.read_sql("SELECT * FROM worldinfo", conn)

country_info = []
for index, row in worldinfoDF.iterrows():
    populcation_dict = {
        "country": row["country"],
        "gdp_per_capita": row["gdp_per_capita"],
        "population": row["population"],
        "growthrate": row["growthrate"],
        "countrysize": row["countrysize"],
        "pop_den": row["pop_den"],
        "happiestScore": row["happiestScore"]
    }
    country_info.append(populcation_dict)
#################################################
# Database endd
#################################################
@app.route("/")
def entrance():
    """Return the homepage."""
    return render_template("index.html")


@app.route("/getCountryData")
def getMapData():
    return jsonify(country_info)


@app.route("/getCompartionList")
def comparation():

    columns_name = worldinfoDF.columns.tolist()

    return jsonify(columns_name[2:])

@app.route("/getCountryName")
def getcounrtyname():

    country_name = worldinfoDF.loc[:,"country"].tolist()

    return jsonify(country_name)


@app.route("/metadata/<country>")
def getCountryData(country):

    currentCountry = worldinfoDF[worldinfoDF.loc[:,'country'] == country]

    countryInfo = {
        'Country Name': currentCountry.iloc[0]["country"],
        'GDP per capita': currentCountry.iloc[0]["gdp_per_capita"],
        'Population': currentCountry.iloc[0]["population"],
        'Growth Rate': currentCountry.iloc[0]["growthrate"],
        'Area': currentCountry.iloc[0]["countrysize"],
         'Population Density': currentCountry.iloc[0]["pop_den"],
         'Happiest Score': currentCountry.iloc[0]["happiestScore"]
    }


    return jsonify(countryInfo)


@app.route("/metafindcountry/<country>")
def metafindcountry(country):

    isEmpty = len(worldinfoDF[worldinfoDF.loc[:,'country'] == country])

    return jsonify({"findIt": isEmpty})

@app.route("/metafindselectcountries/<countryList>")
def metafindselectcountries(countryList):
    listString = countryList.split(',')
    selectCountry = worldinfoDF[worldinfoDF['country'].isin(listString)]
    select_info = []
    for index, row in selectCountry.iterrows():
        populcation_dict = {
            "country": row["country"],
            "GDP per Capita": row["gdp_per_capita"],
            "population": row["population"],
            "Growth Rate": row["growthrate"],
            "countrysize": row["countrysize"],
            "Populcation Density": row["pop_den"],
            "Happiest Score": row["happiestScore"]
        }


        select_info.append(populcation_dict)

 
    return jsonify(select_info)


@app.route("/map")
def load_map():
    return render_template("geomap.html")

@app.route("/showdata")
def showdata():
    return render_template("showdata.html")

@app.route("/loaddata")
def load_data():
    # scrape.scrapeData(conn)
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)
