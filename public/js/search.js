import { dispError,clearErrors } from "./error.js";
import { dispMovies } from "./dispMovies.js";

const searchForm = document.querySelector('.search-form');
const searchInput = searchForm.querySelector('input[name=search]');
// const dispSection = document.querySelector('.display-container');
// const movieCardTemplate = document.querySelector('#dynamic-movie-template');
let errorFlag = false;

const searchMovieAPI = async(query)=>{
    try {
        const response = await axios.get('/movie/search',{
            params: {
                query: query
            }});
        const result = response.data
        dispMovies(result,`Search Results for ${query}`,'search');
    } catch (error) {
        throw error; //propagate error to the eventListener of form(where the error details are to be displayed)
    }   
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
        searchInput.classList.remove('ring-red-400','ring-2');
        searchInput.classList.add('focus:ring-2','focus:ring-imdb-yellow');
        try {
            console.log('searching...');
            await searchMovieAPI(searchQuery);
        } catch (error) { //axios error
            dispError(error.response.data.message,error.response.data.field);
            // searchInput.classList.remove('focus:ring-2','focus:ring-imdb-yellow');
            // searchInput.classList.add('ring-red-400','ring-2');
        }
    }else{
        errorFlag = true;
        dispError(message,field);
        searchInput.classList.remove('focus:ring-2','focus:ring-imdb-yellow');
        searchInput.classList.add('ring-red-400','ring-2');
    } 
});

searchInput.addEventListener('input', async()=>{
    if(errorFlag){
        const searchQuery = searchInput.value.trim();
        if(searchQuery && searchQuery.length>=3 && searchQuery.length<=18){
            clearErrors();
            searchInput.classList.remove('ring-red-400','ring-2');
            searchInput.classList.add('focus:ring-2','focus:ring-imdb-yellow');
            errorFlag = false;
        }
    }
});

//when focus (increase in size)
searchInput.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.01)';
        });

//when no focus, scale back to original size
searchInput.addEventListener('blur', function() {
    this.parentElement.style.transform = 'scale(1)';
});