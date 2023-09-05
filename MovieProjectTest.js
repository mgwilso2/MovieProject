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
    console.log(movies);

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
    movies.forEach( movie =>  {
        const movieTitle = movie.title;
        createMovieElement(movieTitle);
    });
    // resultsElement.innerHTML= movieTitleString;
}

async function getMovieList () {
    const movieEndpoint = '/search/movie';
    const userInput = document.getElementById("title").value;
    //console.log(userInput);

    const filterTerms = `?api_key=${apiKey}&query=${userInput}`;
    const urlToFetch = tmdbBaseUrl + movieEndpoint + filterTerms;

    try {
        const response = await fetch(urlToFetch);
        if (response.ok) {
            const jsonResponse = await response.json();
            let totalPages = jsonResponse.total_pages;
            console.log(totalPages);
            const movies = jsonResponse.results;
            console.log(movies);
            return movies;
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