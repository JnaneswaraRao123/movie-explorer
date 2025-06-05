const API_KEY = "884dcfdb18d7928a8642c6a74a97aa4a";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

const movieList = document.getElementById("movie-list");
const searchInput = document.getElementById("search");

async function fetchMovies(url) {
  const res = await fetch(url);
  const data = await res.json();
  displayMovies(data.results);
}

function displayMovies(movies) {
  movieList.innerHTML = "";
  movies.forEach(movie => {
    const { title, poster_path, vote_average } = movie;
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");
    movieCard.addEventListener('click', () => {
      showMovieModal(movie.id);
    });

    movieCard.innerHTML = `
      <img src="${poster_path ? IMG_URL + poster_path : 'https://via.placeholder.com/500x750?text=No+Image'}" alt="${title}">
      <div class="movie-info">
        <h3>${title}</h3>
        <p>Rating: ${vote_average}</p>
      </div>
    `;

    movieList.appendChild(movieCard);
  });
}


fetchMovies(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);

searchInput.addEventListener("keyup", () => {
  const query = searchInput.value.trim();
  if (query) {
    fetchMovies(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`);
  } else {
    fetchMovies(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
  }
});

function showMovieModal(movieId) {
  fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`)
    .then(res => res.json())
    .then(movie => {
      document.getElementById('modal-poster').src = movie.poster_path 
        ? IMG_URL + movie.poster_path 
        : 'https://via.placeholder.com/500x750?text=No+Image';
      document.getElementById('modal-title').innerText = movie.title;
      document.getElementById('modal-overview').innerText = movie.overview;
      document.getElementById('modal-rating').innerText = movie.vote_average;

      
      fetch(`${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`)
        .then(res => res.json())
        .then(data => {
          const actors = data.cast.slice(0, 5).map(actor => actor.name).join(', ');
          document.getElementById('modal-actors').innerText = actors;
        });

      document.getElementById('movie-modal').classList.remove('hidden');
    });
}


document.querySelector('.close-button').addEventListener('click', () => {
  document.getElementById('movie-modal').classList.add('hidden');
});
