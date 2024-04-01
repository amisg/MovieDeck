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

async function fetchData() {
	const url =
		"https://api.themoviedb.org/3/search/movie?query=Jack+Reacher&api_key=f0bea3723e095ad51220a30980e83c22";
	const response = await fetch(url);
	const data = await response.json();
	return data;
}

console.log(fetchData());
