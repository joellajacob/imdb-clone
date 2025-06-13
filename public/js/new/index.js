import { searchMovieAPI } from "./apiCalls.js";
import initSearch from "./searchNew.js";
import { dispError } from "../error.js";
import dispMovies from "./dispSection.js";

const pageTitle = document.querySelector('title');
const mainSection = document.querySelector('main');
const dispContainer = document.querySelector('.display-container');
const initialPopularMovies = document.querySelector('#initial-popular-movie-data');
const header = document.querySelector('header');
const logo = header.querySelector('.logo');
const sectionTitle = mainSection.querySelector('.section-title');
const movieDispSection = dispContainer.querySelector('.movie-grid');
const emptyResultSection = dispContainer.querySelector('.empty-result-container');
const browsePopularButton = emptyResultSection.querySelector('button');

let cachedPopularMovies = null;

const rerenderPopularMovies = ()=>{
    sectionTitle.innerText = 'Popular Movies';
    if(cachedPopularMovies){
        const {data,baseImgURL} = cachedPopularMovies;
        emptyResultSection.classList.add('hidden');
        movieDispSection.classList.remove('hidden');
        dispMovies(data,baseImgURL);
    }else{
        dispError('Error displaying the popular movies.Please refresh the page','server');
    }
}

const parsePopularMovieData = async()=>{
    try {
        cachedPopularMovies = await JSON.parse(initialPopularMovies.textContent); //cached data
    } catch (error) {
        cachedPopularMovies = null;
    }
}

const emptyResultDisp = (queryType) =>{
    let specificMsg = emptyResultSection.querySelector('.empty-specific-msg');
    let additionalMsg = emptyResultSection.querySelector('.empty-additional-msg');

    specificMsg.innerText = 'We couldn\'t find any movies matching your ' + (queryType==='search'?'search criteria' : 'filter criteria');
    additionalMsg.innerText = 'Try changing your ' + (queryType==='search'?'search terms' : 'filters');
}

const handleDisplaySection = (result,query,queryType)=>{
    sectionTitle.innerText = `Search Results for "${query}"`;
    const movieList = result.data;
    const baseImgURL = result.baseImgURL;
    dispContainer.classList.remove('hidden');
    if(movieList.length === 0){
        movieDispSection.classList.add('hidden');
        emptyResultSection.classList.remove('hidden');
        emptyResultDisp(queryType);
    }else{
        emptyResultSection.classList.add('hidden');
        movieDispSection.classList.remove('hidden');
        dispMovies(movieList,baseImgURL);
    }
}

const validatedSearch = async(query)=>{
    pageTitle.innerText = 'IMDB | Search Results';
    try{
        await searchMovieAPI(query,handleDisplaySection);
    }catch(error){
        dispContainer.classList.add('hidden');
        console.error(error);
        dispError(error.response.data.message,error.response.data.field);
    }
}

const initialiseApp = ()=>{
    //each func: the event listeners are set up once, and will be active continously
    parsePopularMovieData();
    initSearch(validatedSearch);
    browsePopularButton.addEventListener('click',rerenderPopularMovies);
    logo.addEventListener('click',rerenderPopularMovies);
}

document.addEventListener('DOMContentLoaded',initialiseApp);