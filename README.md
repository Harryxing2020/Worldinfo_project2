Publish website
aws: http://harryxing2021.us-west-1.elasticbeanstalk.com/


# project 2
# Flask app   
### How to get the endpoints?   
1. Start the app by `python application.py`  
2. Retrieve the data points in json
@app.route("/")
def entrance():
    """Return the homepage."""
    return render_template("index.html")


@app.route("/getCountryData")
def getMapData():
   #Retrieve the data points in json
    return jsonify(country_info)


@app.route("/getCompartionList")
def comparation():
   #Retrieve columns name in json
    columns_name = worldinfoDF.columns.tolist()

    return jsonify(columns_name[2:])

@app.route("/getCountryName")
def getcounrtyname():
   #Retrieve country name in json
    country_name = worldinfoDF.loc[:,"country"].tolist()

    return jsonify(country_name)


@app.route("/metadata/<country>")
#Retrieve one country 
def getCountryData(country):


@app.route("/metafindcountry/<country>")

#Retrieve countries in json
def metafindcountry(country):

@app.route("/metafindselectcountries/<countryList>")
def metafindselectcountries(countryList):

@app.route("/showdata")
def showdata():
#show data info 
    return render_template("showdata.html")
