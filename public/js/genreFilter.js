const main = document.querySelector('main');
const triggerButton = main.querySelector('.filter-btn');
const filterPanel = main.querySelector('.filter-panel');
const closeButtonContainer = filterPanel.querySelector('.close-container');
const filterButtonContainer = filterPanel.querySelector('.filter-buttons-container')
const genreSection = filterPanel.querySelector('.genre-filter-group');
const genreList = genreSection.querySelector('ul');
const filterTemplate = main.querySelector('#filter-list-template');
let selectedGenres = [];

const searchMoviesWithFilter = async ()=>{
    const withGenres = selectedGenres.join(',');
    try {
        const response = await axios.get('/api/discover',{
            params:{
                with_genres: withGenres
            }
        });
        const data = response.data;
        console.log(data);
    } catch (error) {
        
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

    const clearFilterButton = document.createElement('button');
    clearFilterButton.innerText = 'Clear All Filters';
    const applyFilterButton = document.createElement('button');
    applyFilterButton.innerText = 'Apply';
    applyFilterButton.addEventListener('click',()=>{
        toggleFilterPanel();
        searchMoviesWithFilter();
    })
    filterButtonContainer.append(clearFilterButton,applyFilterButton);
   
    populateGenre(genreData);
}

const filterAPI = async () =>{ //called when page loads
    try {
        const response = await axios.get('/api/genres');
        const genreData = response.data;
        populateFilterPanel({genreData});
        // console.log(genreData);
    } catch (error) {
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
    }else{ //deleting
        updateSelectedGenreList(false,itemCheckBox.value);
    }
    console.log(selectedGenres);
})


//main
filterAPI();