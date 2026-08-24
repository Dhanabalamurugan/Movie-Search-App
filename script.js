const API_KEY="19cca573";
const BASE_URL="https://www.omdbapi.com/";

const searchInput = document.getElementById('movie-search');
const searchButton = document.getElementById('search-btn');
const movieContainer = document.getElementById('movie-container');

function fetchMovies(){
    const query = searchInput.value.trim();

    if (query == ''){
        alert("Enter a movie title ")
        return;
    }

    searchButton.disabled = true;                          // Prevents double clicks spamming the API
    searchButton.textContent = "Searching...";

    movieContainer.innerHTML = `
        <div class="loading-box">
        <div class="spinner"></div>
        <p>Searching the database...</p>
        </div>`;

    const FULL_URL = `${BASE_URL}?apikey=${API_KEY}&s=${query}`;   //use backticks for template literal synatx

    fetch(FULL_URL)
        .then((response) => response.json())
        .then((data) => {
            movieContainer.innerHTML="";                 //clear all older data first

            if (data.Response === "True"){
                data.Search.forEach((movie) =>{
                    const placeholder = "https://placehold.co/300x450"; //Placeholder for broken images

                    const movieCardHTML = `
                    <div class="movie-card">
                        <img src="${movie.Poster}" alt="${movie.Title} Poster" 
                        onerror="this.onerror=null; this.src='${placeholder}';">

                        <h3>${movie.Title}</h3>
                        <p>Year: ${movie.Year}</p>
                    </div>`;
                    movieContainer.innerHTML += movieCardHTML;
                })
                
            }else{
                const errorMessage = data.error || "An error occured.";
                movieContainer.innerHTML = `
                <div class="error-container">
                <p class="error-msg"> ${errorMessage} Try searching for something else.</p>
                </div>`;
            
                movieContainer.innerHTML = `<p class="error-msg"> No matching results found for "${query}".</p>`;
            }
        })
        .catch((error) => {
            console.error("Network error happened:", error)
            movieContainer.innerHTML = `<p class="error-msg"> Network error. Please check your connection.</p>`;
        })

        .finally(() =>{
            searchButton.disabled = false;
            searchButton.textContent = "Search";
        });
}

searchButton.addEventListener("click",fetchMovies);
searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter"){
        fetchMovies();
    }
});

