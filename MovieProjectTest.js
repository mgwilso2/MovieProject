/** API connection information */
const apiKey = 'fcdc9b92007d6d0e09f0c4a8cbc71395';
const tmdbBaseUrl = 'https://api.themoviedb.org/3';
const basePosterPath = 'https://image.tmdb.org/t/p/original';

/** A document element for the search button */
const buttonElement = document.getElementById('searchButton');
/** An HTML element used for displaying search results */
const resultsElement = document.getElementById('resultsBox');
resultsElement.contentEditable;

/**
 * Called when the search button is clicked. Makes a call to get an object with the
 * search results.  Clears any previously displayed search results. Makes a call to
 * display the results of the search
 * 
 * @param domElement the element that should be updated with the search results
 */
const searchClicked = async (domElement) => {
    if (domElement.style.display === 'none') {
        domElement.style.display = 'block';
    }

    // Gets the search results and clears any previously displayed results
    const movies = await getMovieList();

    clearResults();
    displayInputValue(movies);

};

/**
 * Sets a listener for the search button that calls searchClicked
 */
buttonElement.addEventListener('click', () => {
    searchClicked(resultsElement);
});

/**
 * Sets a listener for if the enter button is pressed in the search box
 */
document.getElementById("title").addEventListener('keypress', (e) => {
    if(e.key === 'Enter') {
        searchClicked(resultsElement);
    }
});

/**
 * Responsible for working through the search results array
 * @param domElement the results element.  currently not used
 * @param movies an object containing the search results
 */
function displayInputValue(movies) {

    movies.results.forEach( movie =>  {
        
        createMovieElement(movie);
    });
}

/**
 * Completes the API call(s) to get the movie data. This will complete a call for each
 * page in the initial response. All data is stored in an object and returned to the caller
 * 
 * @returns an object with the search results data
 */
async function getMovieList () {
    // Set up initial search parameters
    const movieEndpoint = '/search/movie';
    const userInput = document.getElementById("title").value;
    let pageNumber = 1;

    let filterTerms = `?api_key=${apiKey}&query=${userInput}&page=${pageNumber}`;
    let urlToFetch = tmdbBaseUrl + movieEndpoint + filterTerms;

    // Create an object to store results data
    let movieResult = new Object();

    // Always completed an initial search
    try {
        const response = await fetch(urlToFetch);
        if (response.ok) {
            const jsonResponse = await response.json();
            const totalPages = jsonResponse.total_pages;

            // Save initial results to the results object
            movieResult.totalPages = jsonResponse.total_pages;
            movieResult.results = jsonResponse.results;
            movieResult.totalResults = jsonResponse.total_results;

            // While there are more pages, search the next page and then add the new movies
            // to the results array
            while( pageNumber < totalPages ) {

                pageNumber++;
                let filterTermsLoop = `?api_key=${apiKey}&query=${userInput}&page=${pageNumber}`;
                let urlToFetchLoop = tmdbBaseUrl + movieEndpoint + filterTermsLoop;

                try {
                    const responseTwo = await fetch(urlToFetchLoop);
                    if (responseTwo.ok) {
                        const jsonResponseTwo = await responseTwo.json();
                        movieResult.results = movieResult.results.concat(jsonResponseTwo.results);
                    }
                } catch (error) {
                    console.log(error);
                }

            }
            console.log(movieResult);
            return movieResult;
        }
    } catch (error) {
        console.log(error);
    }

}

function createMovieElement(movie) {
    // Create the results element
    let newMovieElement = document.createElement('div');
    // newMovieElement.style.backgroundColor = 'DodgerBlue';
    newMovieElement.setAttribute('class', 'movieResult');
    // newMovieElement.style.height = '150px';
    // newMovieElement.setAttribute('id', 'result');
    // newMovieElement.style.display = 'block';

    // Create the title element
    let movieTitle = document.createElement('h3');
    movieTitle.innerHTML = movie.title;
    movieTitle.setAttribute('class', 'movieTitle');
    // let desc = document.createElement('p');
    // movieParagraph.setAttribute('align', 'left'); // changed align
    // movieParagraph.style.padding = '5px';
    // movieParagraph.style.paddingLeft = '50px';

    // Create the poster element
    let poster = document.createElement('img');
    poster.setAttribute('class', 'poster');
    movie.poster_path !== null ? poster.setAttribute('src', basePosterPath + movie.poster_path) : poster.setAttribute('src', './no_image_found.jpg');
    // poster.setAttribute('height', '100');
    // poster.setAttribute('src', basePosterPath + movie.poster_path);
    // poster.setAttribute('align', 'left');

    // Create the description element
    let desc = document.createElement('p');
    desc.innerHTML = movie.overview;
    desc.setAttribute('class', 'desc');

    // Create the release date element
    let release = document.createElement('p');
    release.innerHTML = 'Released: ' + movie.release_date;
    release.setAttribute('class', 'releaseDate');


    // newMovieElement.appendChild(poster);
    // Add created values
    newMovieElement.appendChild(release);
    newMovieElement.insertBefore(desc, release);
    newMovieElement.insertBefore(movieTitle, desc);
    newMovieElement.insertBefore(poster, movieTitle);
    resultsElement.appendChild(newMovieElement);
}

/**
 * Used to clear the previous search results
 * 
 * NOTE - this will run at n time. try to find an option with a better runtime
 */
function clearResults() {
    let firstChild = resultsElement.firstElementChild;
    while (firstChild) {
        firstChild.remove();
        firstChild = resultsElement.firstElementChild;
    }
}

// making a small change to test committing updates