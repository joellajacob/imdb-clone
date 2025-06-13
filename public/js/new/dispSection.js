const mainSection = document.querySelector('main');
const dispContainer = mainSection.querySelector('.display-container');
const movieDispSection = dispContainer.querySelector('.movie-grid');
const movieCardTemplate = mainSection.querySelector('#dynamic-movie-template');

const clearMovieGridSection = ()=>{
    movieDispSection.innerHTML = '';
}

export default function dispMovies(movieList,imgURL){
    clearMovieGridSection();        
    movieList.forEach(movie =>{
    const clonedMovieCard = movieCardTemplate.content.cloneNode(true);
    const movieLink = clonedMovieCard.querySelector('a');
    const movieTitle = clonedMovieCard.querySelector('.movie-title');
    const movieDate = clonedMovieCard.querySelector('.movie-year');
    const movieRatingDiv = clonedMovieCard.querySelector('.movie-rating-badge');
    const movieRating = movieRatingDiv.querySelector('span');
    if(movie.poster_path){
        const img = clonedMovieCard.querySelector('img');
        img.setAttribute('src',`${imgURL}${movie.poster_path}`);
        img.setAttribute('alt',`${movie.title} Poster`);
        img.classList.remove('movie-img-placeholder');
        img.classList.add('movie-img');
    }
    movieLink.setAttribute('href',`/movie/${movie.id}`);
    movieRating.innerText = movie.formattedRating;
    movieTitle.innerText = movie.title;
    movieDate.innerText = movie.release_date.split("-")[0];
    movieDispSection.append(clonedMovieCard);
    })
}