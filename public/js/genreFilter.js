import {clearDispSection,dispMovies} from "./dispMovies.js";
import { dispError, clearErrors} from "./error.js";

const main = document.querySelector('main');
const pageTitle = document.querySelector('title');
const triggerButton = main.querySelector('.filter-btn');
const filterPanel = main.querySelector('.filter-panel');
const closeButtonContainer = filterPanel.querySelector('.close-container');
const filterButtonContainer = filterPanel.querySelector('.filter-buttons-container')
const genreSection = filterPanel.querySelector('.genre-filter-group');
const genreList = genreSection.querySelector('ul');
const filterTemplate = main.querySelector('#filter-item-template');
let initialPopularMovies = document.querySelector('#initial-popular-movie-data');
let cachedPopularMovies = null;
let selectedGenres = [];
let selectedFilters = [];

const updateSelectedFilterList = (checked,filterName)=>{
     if(checked){
        selectedFilters.push(filterName);
    }
    else{
        let index = selectedFilters.findIndex(genre => genre === filterName);
        selectedFilters.splice(index,1);
    }
}

const parsePopularMovieData = ()=>{
    try {
        cachedPopularMovies = JSON.parse(initialPopularMovies.textContent); //cached data
    } catch (error) {
        cachedPopularMovies = null;
    }
}

const searchMoviesWithFilter = async ()=>{       
    try {
        const withGenres = selectedGenres.join(',');
        if(!withGenres){ //no filters selected
            if(cachedPopularMovies){
                dispMovies(cachedPopularMovies,'Popular Movies');
            }else{
                clearDispSection();
                let mainMsg = 'Error displaying the popular movies.Please refresh the page.';
                let specificMsg = null;
                dispError({mainMsg,specificMsg},'general');
            }
        }else{
            const response = await axios.get('/api/discover',{
            params:{
                with_genres: withGenres
            }});
            const result = response.data;
            console.log(selectedGenres);
            console.log(selectedFilters);
            pageTitle.innerText = 'IMDB | Search Results';
            dispMovies(result,`Search Results for "${selectedFilters.join(' \u00B7 ')}"`,'filter');
        }
    } catch (error) {
        throw error;
    }
}

const updateSelectedGenreList = (checked,genreId)=>{
    genreId = parseInt(genreId);
    if(checked){
        selectedGenres.push(genreId);
    }
    else{
        let index = selectedGenres.findIndex(genre => genre === genreId);
        selectedGenres.splice(index,1);
    }
}

const clearSelectedGenreList = ()=>{
    selectedGenres.forEach(genre=>{
        let selectedListItem = genreList.querySelector(`input[value="${genre}"]`);
        selectedListItem.checked = false;
    })
    selectedGenres = [];
    if(cachedPopularMovies){
        dispMovies(cachedPopularMovies,'Popular Movies');
    }else{
        clearDispSection();
        let mainMsg = 'Error displaying the popular movies.Please refresh the page.';
        let specificMsg = null;
        dispError({mainMsg,specificMsg},'general');
    }
}

const toggleFilterPanel = () =>{
    filterPanel.classList.toggle('filter-panel-active');
}

const populateGenre = (genreData) =>{
    genreData.forEach(genre => {
        const genreItem = filterTemplate.content.cloneNode(true);
        const genreLabel = genreItem.querySelector('label');
        const genreCheckbox = genreItem.querySelector('input[type="checkbox"]');
        genreLabel.innerText = genre.name;
        genreLabel.setAttribute('for',`genre-${genre.id}`);
        genreCheckbox.setAttribute('id',`genre-${genre.id}`);
        genreCheckbox.setAttribute('name',genre.name);
        genreCheckbox.setAttribute('value',genre.id);
        genreList.append(genreItem);
    })
}

const populateFilterPanel = (filterList) =>{
    const {genreData} = filterList;
    const closeButton = document.createElement('button');
    closeButton.innerText = 'X';
    closeButton.setAttribute('aria-label','Close Filter Panel')
    closeButton.addEventListener('click',toggleFilterPanel);
    closeButtonContainer.append(closeButton);
    populateGenre(genreData);
    const clearFilterButton = document.createElement('button');
    clearFilterButton.innerText = 'Clear All Filters';
    clearFilterButton.addEventListener('click',()=>{
        clearErrors();
        clearSelectedGenreList();
    });
    const applyFilterButton = document.createElement('button');
    applyFilterButton.innerText = 'Apply';
    applyFilterButton.addEventListener('click',()=>{
        clearErrors();
        toggleFilterPanel();
        searchMoviesWithFilter();
    });
    filterButtonContainer.append(clearFilterButton,applyFilterButton);
}

const filterAPI = async () =>{ //called when page loads
    try {
        const response = await axios.get('/api/genres');
        const genreData = response.data;
        populateFilterPanel({genreData});
    } catch (error) {
        dispError(error.response.data.message,'filter');
    }
}

triggerButton.addEventListener('click',()=>{
    toggleFilterPanel();
})

genreList.addEventListener('change',(event)=>{
    const listItem = event.target.closest('li');
    const itemCheckBox = listItem.querySelector('input');
    if(itemCheckBox.checked){ //inserting
        updateSelectedGenreList(true,itemCheckBox.value);
        updateSelectedFilterList(true,itemCheckBox.name);
    }else{ //deleting
        updateSelectedGenreList(false,itemCheckBox.value);
        updateSelectedFilterList(false,itemCheckBox.name);
    }
})


//main
parsePopularMovieData();
filterAPI();