const express = require("express");
const request = require('request');
const app = express();


// https://about-corona.net/documentation - site used
app.set("view engine", "ejs");
app.use(express.static('public'));


app.get("/", function (req,res) {
    request('https://corona-api.com/timeline', function (error, response, body) {

        const newCasesList = [];
        const dateList = [];
        
        if (!error && response.statusCode == 200) {

            const timeline = JSON.parse(body);

            for (let i = 0; i < timeline.data.length; i++) {
                newCasesList.push(timeline.data[i].new_confirmed);
                dateList.push(timeline.data[i].date);
            }
            const deaths = timeline.data[0].deaths;
            const recovered = timeline.data[0].recovered;
            const confirmed = timeline.data[0].confirmed;

            res.render("index", {
                timeline:timeline,
                newCasesList:newCasesList,
                dateList:dateList,
                deaths: deaths,
                recovered: recovered,
                confirmed: confirmed
            });
        }
    });
});


app.get("/country", function (req,res) {
    const countryCode = req.query.code;
    const url = 'http://corona-api.com/countries/'+countryCode;
    request(url, function (error, response, body) {

        const timeLineConfirmed = [];
        const timeLineNewConfirmed = [];
        const dateList = [];


        if (!error && response.statusCode == 200) {
            const country = JSON.parse(body);

            for (let i = 0; i < country.data.timeline.length; i++) {
                timeLineConfirmed.push(country.data.timeline[i].confirmed)
                timeLineNewConfirmed.push(country.data.timeline[i].new_confirmed)
                dateList.push(country.data.timeline[i].date)
            }

            const todayConfirmed = country.data.today.confirmed;
            const todayDeaths = country.data.today.deaths;
            const latestDeaths = country.data.latest_data.deaths;
            const latestConfirmed = country.data.latest_data.confirmed;
            const latestRecovered = country.data.latest_data.recovered;
            const latestCritical = country.data.latest_data.critical;


            res.render("country", {
                country: country,
                dateList: dateList,
                timeLineConfirmed: timeLineConfirmed,
                timeLineNewConfirmed: timeLineNewConfirmed,
                todayConfirmed: todayConfirmed,
                todayDeaths: todayDeaths,
                latestDeaths: latestDeaths,
                latestConfirmed: latestConfirmed,
                latestRecovered: latestRecovered,
                latestCritical:latestCritical
            });
        }
    });
});


app.get("/countries", function (req,res) {
    request('https://corona-api.com/countries', function (error, response, body) {

        const countriesList = []; 

        if (!error && response.statusCode == 200) {
            const countries = JSON.parse(body);
            for (let i = 0; i < countries.data.length; i++) {
                countriesList.push([countries.data[i].name,countries.data[i].code])
            }

            // console.log(countriesList);

            res.render("countries", {
                countries:countries,
                countriesList: countriesList
            });
        }
    });
});


var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});