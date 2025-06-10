import { dispError } from "./error.js";

const dispSection = document.querySelector('.display-container');
const movieCardTemplate = document.querySelector('#dynamic-movie-template');

export const clearDispSection = ()=>{
    //clear movie cards
    const existingMovieCards = dispSection.querySelectorAll('a');
    existingMovieCards.forEach(card => card.remove());
}

export const dispMovies = (res,query,type)=>{
    const movieList = res.data;
    const imgURL = res.baseImgURL;

    clearDispSection();

    if(movieList.length === 0){
        let dispMsg = type==='search' ? `No search results found for ${query}!` : 'No movies found matching your criteria!';
        dispError(dispMsg,'general');        
    }else{
        movieList.forEach(movie =>{
        const clonedMovieCard = movieCardTemplate.content.cloneNode(true);
        const movieLink = clonedMovieCard.querySelector('a');
        const movieTitle = clonedMovieCard.querySelector('.movie-title');
        const movieDate = clonedMovieCard.querySelector('.movie-date');
        movieLink.setAttribute('href',`/movie/${movie.id}`);
        if(movie.poster_path){
            const img = clonedMovieCard.querySelector('img');
            img.setAttribute('src',`${imgURL}${movie.poster_path}`);
            img.setAttribute('alt',`${movie.title} Poster`);
        }
        movieTitle.innerText = movie.title;
        movieDate.innerText = movie.release_date.split("-")[0];

        dispSection.append(clonedMovieCard);
    })}    
};
