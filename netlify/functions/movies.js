// allows us to read csv files
let csv = require('neat-csv')

// allows us to read files from disk
let fs = require('fs')

// defines a lambda function
exports.handler = async function(event) {
  // write the event object to the back-end console
  console.log(event)

  // read movies CSV file from disk
  let moviesFile = fs.readFileSync(`./movies.csv`)
  
  // turn the movies file into a JavaScript object, wait for that to happen
  let moviesFromCsv = await csv(moviesFile)

  // write the movies to the back-end console, check it out
  console.log(moviesFromCsv)

  // 🔥 hw6: your recipe and code starts here!
  
  // Get and store the year and genre from user entered parameters
  let year = event.queryStringParameters.year
  let genre = event.queryStringParameters.genre
  
  
  // Error check - provides 'Nope' response if user does not define a yearan genre
  if (year == undefined || genre == undefined) {
    return {
      statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      body: `Nope!` // a string of data
    }
  }
  
  // If user correctly enters a year and genre, then create a new object to return number of results and list of movies
  else {
    let returnValue = {
      numResults: 0,
      movies: []
    }

    // Create a loop through all of the movies
    for (let i=0; i < moviesFromCsv.length; i++) {
      
      // Store each movie
      let movie = moviesFromCsv[i] 

      // Error check - if movie meets user entered parameters, ignore movies that do not have a runtime (runtimeMinutes = `//N`)
      if (movie.genres.includes(genre) == true && movie.startYear == year && movie.runtimeMinutes != '\\N') {

        // Create an object with the details for each movie
        let movieData = {
          primaryTitle: movie.primaryTitle,
          releaseYear: movie.startYear,
          genres: movie.genres
        }
        
        // Add the movie to the array to return
        returnValue.movies.push(movieData)
      }
        // Calculate and return the number of results in the array
        returnValue.numResults = returnValue.movies.length
    }

    // a lambda function returns a status code and a string of data
    return {
      statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      
      // Return the actual data from the API
      body: JSON.stringify(returnValue)
    }
  }
}