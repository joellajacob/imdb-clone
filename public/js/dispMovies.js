import { dispError } from "./error.js";

const mainSection = document.querySelector('main');
const dispSection = mainSection.querySelector('.display-container');
const movieCardTemplate = mainSection.querySelector('#dynamic-movie-template');
const sectionTitle = mainSection.querySelector('.section-title');

export const clearDispSection = ()=>{
    //clear movie cards
    const existingMovieCards = dispSection.querySelectorAll('a[class="movie-card"]');
    console.log(existingMovieCards);
    existingMovieCards.forEach(card => card.remove());
}

export const dispMovies = (res,query,type)=>{
    const movieList = res.data;
    const imgURL = res.baseImgURL;
    clearDispSection();
    sectionTitle.innerText = query;
    if(movieList.length === 0){
        let mainMsg = 'No movies found!';
        let specificMsg = 'We couldn\'t find any movies matching your ';
        specificMsg += type==='search' ? 'search criteria' : 'filter criteria';
        dispError({mainMsg,specificMsg},'general');        
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
