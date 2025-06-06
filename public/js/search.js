const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('input[name=search]');
const dispSection = document.querySelector('.display-container');
const movieCardTemplate = document.querySelector('#dynamic-movie-template');
const errorDiv = document.querySelector('.search-error-msg');
let errorFlag = false;

const searchMovieAPI = async(query)=>{
    try {
        const response = await axios.get('/movie/search',{
            params: {
                query: query
            }});
        const data = response.data
        dispMovies(data,query);
    } catch (error) {
        console.error(error);
        dispError()
    }   
};

const dispError = (msg)=>{
    const emptySearch = document.createElement('p');
    emptySearch.innerText = msg;
    dispSection.append(emptySearch);
}

const dispMovies = (data,query)=>{
    const movieList = data.data;
    const URL = data.baseURL;

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
            img.setAttribute('src',`${URL}${movie.poster_path}`);
            img.setAttribute('alt',`${movie.title} Poster`);
        }
        movieTitle.innerText = movie.title;
        movieDate.innerText = movie.release_date.split("-")[0];

        dispSection.append(clonedMovieCard);
    })}    
};

const searchValidation = (query)=>{
     if(!query){ //if empty search
        errorDiv.innerText = 'Enter movie title';
        return true;
    }
    else if(query.length<3){ //min length
        errorDiv.innerText = 'Please enter at least 3 characters to search';
        return true;
    }
    else if(query.length>18){ //max length
        errorDiv.innerText = 'Please enter no more than 18 characters to search';
        return true;
    }
    else{
        return false;
    }
}

searchForm.addEventListener('submit', async (event)=>{
    event.preventDefault();
    const searchQuery = searchInput.value.trim();
    errorFlag = searchValidation(searchQuery);
    if(!errorFlag){
        try {
            await searchMovieAPI(searchQuery);
        } catch (error) {
            
        }
    }  
});

searchInput.addEventListener('input', async()=>{
    if(errorFlag){
        const searchQuery = searchInput.value.trim();
        if(searchQuery && searchQuery.length>=3 && searchQuery.length<=18){
            errorDiv.innerText = '';
            errorFlag = false;
        }
    }
    else if(searchInput.value === ''){

    }
});