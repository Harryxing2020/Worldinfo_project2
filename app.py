 
import os
import pandas as pd
import numpy as np

from flask import Flask, jsonify, render_template


# import sqlalchemy
# from sqlalchemy.ext.automap import automap_base
# from sqlalchemy.orm import Session
# from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
app = Flask(__name__)
#################################################
# Database Setup
#################################################
from sqlalchemy import create_engine
engine = create_engine("sqlite:///db/worldinfo.sqlite")

conn = engine.connect()

worldinfoDF = pd.read_sql("SELECT * FROM worldinfo", conn)

country_info = []
for index, row in worldinfoDF.iterrows():
    populcation_dict = {
        "country":row["country"],
        "gdp_per_capita":row["gdp_per_capita"],
        "population":row["population"],
        "growthrate":row["growthrate"],
        "countrysize":row["countrysize"],
        "pop_den":row["pop_den"],
        "happiestScore":row["happiestScore"]
    }
    country_info.append(populcation_dict)
      
#################################################
# Database end
#################################################


@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")


@app.route("/getCountryData")
def getMapData():
    return jsonify(country_info)

if __name__ == "__main__":
    app.run(debug=True)