let currentPage = 1;

// selectors

const movieListContainer = document.getElementById("movie-list");

// Search bar Elements
const searchInputBoxElement = document.getElementById("search-input");
const searchButtonElement = document.getElementById("search-button");

// sorting option button selector
const sortByDateButtonElement = document.getElementById("sort-by-date");
const sortByRateButtonElement = document.getElementById("sort-by-rating");

// tab button Selector
const allTabButtonElement = document.getElementById("all-tab");
const favouritesTabButtonElement = document.getElementById("favourites-tab");

// pagination button selector
const prevButtonElement = document.getElementById("prev-button");
const nextButtonElement = document.getElementById("next-button");
const pageNumberButtonElement = document.getElementById("page-number-button");

// 1.fetch data

function remapData(movieList = []) {
	const modifiedList = movieList.map((movieObj) => {
		return {
			id: movieObj.id,
			title: movieObj.title,
			posterPath: movieObj.poster_path,
			popularity: movieObj.popularity,
			voteAverage: movieObj.vote_average,
		};
	});
	return modifiedList;
}

async function fetchData(pageNumber, sortingOption) {
	let url = "";
	if (sortingOption) {
		url = `https://api.themoviedb.org/3/discover/movie?api_key=f0bea3723e095ad51220a30980e83c22&language=en-US&page=${pageNumber}&sort_by=popularity.desc`;
	} else {
		url = `https://api.themoviedb.org/3/movie/top_rated?api_key=f0bea3723e095ad51220a30980e83c22&language=en-US&page=${pageNumber}`;
	}
	const response = await fetch(url);
	const data = await response.json();
	const results = data["results"];
	const modifiedList = remapData(results);
	console.log(modifiedList);
	return modifiedList;
}

// render data

function renderMovies(movieList = []) {
	movieList.forEach((movie) => {
		const movieCardHtml = createCardForMovie(movie);
		movieListContainer.append(movieCardHtml);
	});
}

function createCardForMovie(movie) {
	const { id, title, posterPath, popularity, voteAverage } = movie;
	const imageLink = "https://image.tmdb.org/t/p/original/" + posterPath;
	const cardContainerElement = document.createElement("div");
	cardContainerElement.id = id;
	cardContainerElement.classList.add("card");

	cardContainerElement.innerHTML = `
	<section>
		<img class="poster" src=${imageLink} alt="movie image" />
	</section>
	<p class="title">${title}</p>
	<section class="votes-favourites">
		<section class="votes">
			<p class="vote-count">Votes: ${voteAverage}</p>
			<p class="popularity-count">Popularity: ${popularity}
		</section>
		<section class="favourites">
			heart
		</section>
	</secton>
	`;
	return cardContainerElement;
}

function clearMovies() {
	movieListContainer.innerHTML = "";
}

async function facilitator(sortOption = false) {
	const data = await fetchData(currentPage, sortOption);
	clearMovies();
	renderMovies(data);
}

facilitator();
//pagination

// click listeners

prevButtonElement.addEventListener("click", () => {
	currentPage--;
	facilitator();
	pageNumberButtonElement.innerHTML = `currentPage: ${currentPage}`;
	// if (currentPage === 1) {
	// 	prevButtonElement.disabled = true;
	// } else {
	// 	prevButtonElement.disabled = false;
	// }
});

nextButtonElement.addEventListener("click", () => {
	currentPage++;
	facilitator();
	pageNumberButtonElement.innerHTML = `currentPage: ${currentPage}`;
	// if (currentPage === 1) {
	// 	nextButtonElement.disabled = false;
	// } else {
	// 	nextButtonElement.disabled = true;
	// }
});

sortByRateButtonElement.addEventListener("click", () => {
	facilitator(true);
});
