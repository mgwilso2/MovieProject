/** API connection information */
const apiKey = 'fcdc9b92007d6d0e09f0c4a8cbc71395';
const tmdbBaseUrl = 'https://api.themoviedb.org/3';

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

    displayInputValue(domElement, movies);

};

/**
 * Sets a listener for the search button that calls searchClicked
 */
buttonElement.addEventListener('click', () => {
    searchClicked(resultsElement);
});

/**
 * Responsible for working through the search results array
 * @param domElement the results element.  currently not used
 * @param movies an object containing the search results
 */
function displayInputValue(domElement, movies) {

    movies.results.forEach( movie =>  {
        const movieTitle = movie.title;
        createMovieElement(movieTitle);
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
            return movieResult;
        }
    } catch (error) {
        console.log(error);
    }

}

function createMovieElement(title) {
    let newMovieElement = document.createElement('div');
    let movieParagraph = document.createElement('h2');
    newMovieElement.setAttribute('id', 'result');
    movieParagraph.innerHTML = title;
    newMovieElement.appendChild(movieParagraph);
    resultsElement.appendChild(newMovieElement);
}

function clearResults() {
    let firstChild = resultsElement.firstElementChild;
    while (firstChild) {
        firstChild.remove();
        firstChild = resultsElement.firstElementChild;
    }
}

// making a small change to test committing updates