const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('input[name=search]');
const dispSection = document.querySelector('.display-container');
const movieCardTemplate = document.querySelector('#dynamic-movie-template');
const clientErrorDiv = document.querySelector('.search-error-msg');
const otherErrorMsg = document.querySelector('.additional-error-msg');
let errorFlag = false;

const searchMovieAPI = async(query)=>{
    try {
        const response = await axios.get('/movie/search',{
            params: {
                query: query
            }});
        const result = response.data
        dispMovies(result,query);
    } catch (error) {
        throw error; //propagate error to the eventListener of form(where the error details are to be displayed)
    }   
};

const dispError = (msg,field)=>{
    if(field){ //client validation
        clientErrorDiv.innerText = msg;
    }else{ //server validation or empty search
        otherErrorMsg.innerText = msg;
    }
};

const clearErrors = ()=>{
    clientErrorDiv.innerHTML = otherErrorMsg.innerHTML = '';
};

const dispMovies = (res,query)=>{
    const movieList = res.data;
    const ImgURL = res.baseImgURL;

    dispSection.innerHTML = '';
    if(movieList.length === 0){
        dispError(`No search results found for ${query}!`);        
    }else{
        movieList.forEach(movie =>{
        const clonedMovieCard = movieCardTemplate.content.cloneNode(true);
        const movieLink = clonedMovieCard.querySelector('a');
        const movieTitle = clonedMovieCard.querySelector('.movie-title');
        const movieDate = clonedMovieCard.querySelector('.movie-date');
        movieLink.setAttribute('href',`/movie/${movie.id}`);
        if(movie.poster_path){
            const img = clonedMovieCard.querySelector('img');
            img.setAttribute('src',`${ImgURL}${movie.poster_path}`);
            img.setAttribute('alt',`${movie.title} Poster`);
        }
        movieTitle.innerText = movie.title;
        movieDate.innerText = movie.release_date.split("-")[0];

        dispSection.append(clonedMovieCard);
    })}    
};

const searchValidation = (query)=>{
     if(!query){ //if empty search
        return {'isValid': false, 'message': 'Enter movie title','field':'query'};
    }
    else if(query.length<3 || query.length>18){ //min and max length
        return {'isValid': false, 'message': 'Movie title must be between 3 and 18 characters long','field':'query'};
    }
    else{
        return {'isValid': true};
    }
};

searchForm.addEventListener('submit', async (event)=>{
    event.preventDefault();
    const searchQuery = searchInput.value.trim();
    let { isValid, message, field }= searchValidation(searchQuery);
    if(isValid){
        clearErrors();
        try {
            console.log('searching...');
            await searchMovieAPI(searchQuery);
        } catch (error) { //axios error
            dispError(error.response.data.message,error.response.data.field);
        }
    }else{
        errorFlag = true;
        dispError(message,field);
    } 
});

searchInput.addEventListener('input', async()=>{
    if(errorFlag){
        const searchQuery = searchInput.value.trim();
        if(searchQuery && searchQuery.length>=3 && searchQuery.length<=18){
            clearErrors();
            errorFlag = false;
        }
    }
});