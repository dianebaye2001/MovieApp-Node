require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const ejs = require("ejs");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/", (req, res) => {
    res.render("home");
})

app.get("/error", (req, res) => {
    res.render("error");
})

// this is the results route where we are going to fetch our api query results
app.get("/results", (req, res) => {
    // we are grabbing the user query search
    let searchQuery = req.query.searchQuery;
    // axios request using the user query
    axios.get("https://www.omdbapi.com/?i=tt3896198&apikey=" + process.env.API_KEY + "&s=" + searchQuery)
    .then((response) => {
        let movies = response.data.Search;
        res.render("results", {movies: movies});

        })
    .catch(() => {
        res.redirect("/error")
    })
});

app.get("/movies/:movie_id", (req, res) => {
    let movieID = req.params.movie_id;
    
    axios.get("https://www.omdbapi.com/?apikey=e6b6fe9c&i=" + movieID)
    .then((response) => {
        //console.log(response);
        let movie = response.data;
        res.render("movie", {movie: movie});
    })
    .catch(() => {
            res.redirect("/error")  
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