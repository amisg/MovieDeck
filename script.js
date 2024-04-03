let currentPage = 1;
let MOVIE_LIST = [];
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
	MOVIE_LIST = modifiedList;
	// console.log(modifiedList);
	return modifiedList;
}

// render data

function renderMovies(movieList = []) {
	movieList.forEach((movie) => {
		const { id } = movie;
		const movieCardHtml = createCardForMovie(movie);
		movieListContainer.append(movieCardHtml);

		// const favElement = document.getElementById(`favourites${id}`);
		const heartElement = document.getElementById(`icon${id}`);
		heartElement.addEventListener("click", (event) => {
			const movieIdLike = event.target.id;
			const isFavMovie = heartElement.classList.contains("fa-heart");
			if (isFavMovie) {
				removeMovieFromLocalStorage(movieIdLike);
				heartElement.classList.add("fa-heart-o");
				heartElement.classList.remove("fa-heart");
			} else {
				setMoviesToLocalStorage(id);
				heartElement.classList.remove("fa-heart-o");
				heartElement.classList.add("fa-heart");
			}
		});

		// determine if each movie is fav or not
		const favMovies = getMoviesFromLocalStorage();
		const isFavMovie = favMovies.includes(id);
		if (isFavMovie) {
			heartElement.classList.remove("fa-heart-o");
			heartElement.classList.add("fa-heart");
		}
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
		<section style="cursor:pointer" id="favourites${id}" class="favourites">
		<i id=icon${id} class="fa fa-heart-o" aria-hidden="true"></i>
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
	allTabButtonElement.classList.add("active-tab");
}

facilitator();
//pagination

// click listeners

prevButtonElement.addEventListener("click", () => {
	currentPage--;
	facilitator();
	pageNumberButtonElement.innerHTML = `CurrentPage: ${currentPage}`;
	// if (currentPage === 1) {
	// 	prevButtonElement.disabled = true;
	// } else {
	// 	prevButtonElement.disabled = false;
	// }
});

nextButtonElement.addEventListener("click", () => {
	currentPage++;
	facilitator();
	pageNumberButtonElement.innerHTML = `CurrentPage: ${currentPage}`;
	// if (currentPage === 1) {
	// 	nextButtonElement.disabled = false;
	// } else {
	// 	nextButtonElement.disabled = true;
	// }
});

sortByRateButtonElement.addEventListener("click", () => {
	sortByRateButtonElement.classList.toggle("sort-button-active");

	if (sortByRateButtonElement.classList.contains("sort-button-active")) {
		facilitator(true);
	} else {
		facilitator(false);
	}
});

// tabs

function displayMoviesForSwitchedTabs(element) {
	const id = element.id;
	// console.log(id, "elem");
	if (id === "all-tab") {
		sortByDateButtonElement.style.display = "block";
		sortByRateButtonElement.style.display = "block";
		facilitator();
	} else if (id === "favourites-tab") {
		clearMovies();
		const favMovieListIds = getMoviesFromLocalStorage();
		const FavMovieList = MOVIE_LIST.filter((movie) => {
			const { id } = movie;
			return favMovieListIds.includes(id);
		});
		renderMovies(FavMovieList);
		sortByDateButtonElement.style.display = "none";
		sortByRateButtonElement.style.display = "none";
	}
}

function switchTabs(event) {
	allTabButtonElement.classList.remove("active-tab");
	favouritesTabButtonElement.classList.remove("active-tab");
	const element = event.target;
	element.classList.add("active-tab");
	displayMoviesForSwitchedTabs(element);
}

allTabButtonElement.addEventListener("click", switchTabs);
favouritesTabButtonElement.addEventListener("click", switchTabs);

function setMoviesToLocalStorage(newFavMovie) {
	const prevFavMovies = getMoviesFromLocalStorage();
	const arrayOfFavMovies = [...prevFavMovies, newFavMovie];
	localStorage.setItem("favMovie", JSON.stringify(arrayOfFavMovies));
}

function getMoviesFromLocalStorage() {
	const allFavMovieObj = JSON.parse(localStorage.getItem("favMovie"));
	if (!allFavMovieObj) {
		return [];
	} else {
		return allFavMovieObj;
	}
}

function removeMovieFromLocalStorage(id) {
	const allFavMovieObj = getMoviesFromLocalStorage();
	const filteredMovies = allFavMovieObj.filter(
		(ids) => Number(ids) !== Number(String(id).substring(4))
	);
	localStorage.setItem("favMovie", JSON.stringify(filteredMovies));
}

const favIconElement = document.getElementById("favourites");

// favIconElement.addEventListener("click", (event) => {
// 	setMoviesToLocalStorage();
// });
