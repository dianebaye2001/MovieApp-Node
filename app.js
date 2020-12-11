require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const ejs = require("ejs");
let path = require('path');


const app = express();

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/", (req, res) => {
    res.render("home");
})

/*app.get("/error", (req, res) => {
    res.render("error");
})
*/
let api = process.env.API_KEY

// this is the results route where we are going to fetch our api query results
app.get("/results", (req, res) => {
    // we are grabbing the user query search
    let searchQuery = req.query.searchQuery;
    // axios request using the user query
    axios.get("http://www.omdbapi.com/?i=tt3896198&apikey=" + api + "&s=" + searchQuery)
    .then((response) => {
        let movies = response.data.Search;
        res.render("results", {movies: movies});

        })
    .catch((error) => {
        if(error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
            res.render("error", {errorStatusCode: error.response.status});
        }  
    })
});

app.get("/movies/:movie_id", (req, res) => {
    let movieID = req.params.movie_id;
    
    axios.get("http://www.omdbapi.com/?apikey=" + api + "&i=" + movieID)
    .then((response) => {
        //console.log(response);
        let movie = response.data;
        res.render("movie", {movie: movie});
    })
    .catch((error) => {
        if(error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
            res.render("error", {errorStatusCode: error.response.status});
        }  
    })
})



let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started successfully");
});



/*
app.post("/", (req, res) => {
    let searchQuery = req.body.searchQuery
    axios.get("http://www.omdbapi.com/?i=tt3896198&apikey=" + process.env.API_KEY + "&s=" + searchQuery)
    .then((response) => {
        let movies = response.data.Search;
        
        movies.map((movie) => {
            console.log(movie.Title);
        })
        res.render("home", {moviesArr: movies})
    })
    .catch((error) => {
        console.log(error);
    })
})
*/