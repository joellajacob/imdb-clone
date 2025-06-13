import { dispError } from "./error.js";

const mainSection = document.querySelector('main');
const dispContainer = mainSection.querySelector('.display-container');
const movieDispSection = dispContainer.querySelector('.movie-grid');
const emptyResultSection = dispContainer.querySelector('.empty-result-container');
const movieCardTemplate = mainSection.querySelector('#dynamic-movie-template');
const sectionTitle = mainSection.querySelector('.section-title');

export const clearDispSection = ()=>{
    //clear movie cards
    // const existingMovieCards = dispSection.querySelectorAll('a[class="movie-card"]');
    // console.log(existingMovieCards);
    // existingMovieCards.forEach(card => card.remove());
    movieDispSection.innerHTML = '';
}

const emptyResultDisp = (queryType) => {
    movieDispSection.classList.add('hidden');
    emptyResultSection.classList.remove('hidden');
    let specificMsg = emptyResultSection.querySelector('.empty-specific-msg');
    let additionalMsg = emptyResultSection.querySelector('.empty-additional-msg');

    specificMsg.innerText = 'We couldn\'t find any movies matching your ' + queryType==='search'?'search criteria' : 'filter criteria';

    additionalMsg.innerText = 'Try changing your ' + queryType==='search'?'search terms' : 'filters';
}

export const dispMovies = (res,query,queryType)=>{
    const movieList = res.data;
    const imgURL = res.baseImgURL;
    dispContainer.classList.remove('hidden');
    sectionTitle.innerText = query;
    if(movieList.length === 0){
        emptyResultDisp(queryType);
        // let mainMsg = 'No movies found!';
        // let specificMsg = 'We couldn\'t find any movies matching your ';
        // specificMsg += type==='search' ? 'search criteria' : 'filter criteria';
        // dispError({mainMsg,specificMsg},'general');        
    }else{
        movieDispSection.classList.remove('hidden');
        emptyResultSection.classList.add('hidden');
        clearDispSection();        
        movieList.forEach(movie =>{
        const clonedMovieCard = movieCardTemplate.content.cloneNode(true);
        const movieLink = clonedMovieCard.querySelector('a');
        const movieTitle = clonedMovieCard.querySelector('.movie-title');
        const movieDate = clonedMovieCard.querySelector('.movie-year');
        const movieRatingDiv = clonedMovieCard.querySelector('.movie-rating-badge');
        const movieRating = movieRatingDiv.querySelector('span');
        movieLink.setAttribute('href',`/movie/${movie.id}`);
        if(movie.poster_path){
            const img = clonedMovieCard.querySelector('img');
            img.setAttribute('src',`${imgURL}${movie.poster_path}`);
            img.setAttribute('alt',`${movie.title} Poster`);
            img.classList.remove('movie-img-placeholder');
            img.classList.add('movie-img');
        }
        movieRating.innerText = movie.formattedRating;
        movieTitle.innerText = movie.title;
        movieDate.innerText = movie.release_date.split("-")[0];
        movieDispSection.append(clonedMovieCard);
    })}    
};
