/** API connection information */
const apiKey = 'fcdc9b92007d6d0e09f0c4a8cbc71395';
const tmdbBaseUrl = 'https://api.themoviedb.org/3';

const buttonElement = document.getElementById('searchButton');
const resultsElement = document.getElementById('resultsBox');
resultsElement.contentEditable;

const searchClicked = async (domElement) => {
    if (domElement.style.display === 'none') {
        domElement.style.display = 'block';
    }
    const movies = await getMovieList();
    // console.log(movies);

    clearResults();
    displayInputValue(domElement, movies);

};

buttonElement.addEventListener('click', () => {
    searchClicked(resultsElement);
});

function displayInputValue(domElement, movies) {
    // const firstMovie = movies[5];
    // const movieTitle = firstMovie.title;
    // console.log(movieTitle);

    // const inputValue = document.getElementById("title").value;
    movies.results.forEach( movie =>  {
        const movieTitle = movie.title;
        createMovieElement(movieTitle);
    });
    // resultsElement.innerHTML= movieTitleString;
}

async function getMovieList () {
    const movieEndpoint = '/search/movie';
    const userInput = document.getElementById("title").value;
    //console.log(userInput);
    let pageNumber = 1;

    let filterTerms = `?api_key=${apiKey}&query=${userInput}&page${pageNumber}`;
    let urlToFetch = tmdbBaseUrl + movieEndpoint + filterTerms;

    let movieResult = new Object();

    try {
        const response = await fetch(urlToFetch);
        if (response.ok) {
            const jsonResponse = await response.json();
            const totalPages = jsonResponse.total_pages;

            movieResult.totalPages = jsonResponse.total_pages;
            movieResult.results = jsonResponse.results;
            movieResult.totalResults = jsonResponse.total_results;

            while( pageNumber < totalPages ) {
                pageNumber++;
                let filterTerms = `?api_key=${apiKey}&query=${userInput}&page${pageNumber}`;
                let urlToFetch = tmdbBaseUrl + movieEndpoint + filterTerms;
                try {
                    const responseTwo = await fetch(urlToFetch);
                    if (responseTwo.ok) {
                        const jsonResponseTwo = await responseTwo.json();
                        movieResult.results = movieResult.results.concat(jsonResponseTwo.results);
                    }
                } catch (error) {
                    console.log(error);
                }
                // console.log(pageNumber);
                // console.log(movieResult.results);
            }

            const movies = jsonResponse.results;
            // console.log(movies);
            // console.log(movieResult);
            // console.log(movieResult.results);
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