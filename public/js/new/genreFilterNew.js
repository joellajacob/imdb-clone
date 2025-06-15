const main = document.querySelector('main');
const filterPanel = main.querySelector('.filter-panel');
const genreSection = filterPanel.querySelector('.genre-filter-group');
const genreList = genreSection.querySelector('ul');
const filterTemplate = main.querySelector('#filter-item-template');

let selectedGenreId = [];
let selectedGenreNames = [];

const updateSelectedGenreList = (checked,genreId,genreName)=>{
    genreId = parseInt(genreId);
    if(checked){
        selectedGenreId.push(genreId);
        selectedGenreNames.push(genreName);
    }
    else{
        let idIndex = selectedGenreId.findIndex(genre => genre === genreId);
        let nameIndex = selectedGenreNames.findIndex(genre => genre === genreName);
        selectedGenreId.splice(idIndex,1);
        selectedGenreNames.splice(nameIndex,1);
    }
}

function populateGenre(genreData){
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
    });
}

export const getGenreSelections = ()=>{
    return {genreIds: selectedGenreId.join(','),genreNames: selectedGenreNames.join(' \u00B7 ')};
}

export const clearGenreSelections = (rerenderPopularMovies) => {
    selectedGenreId.forEach(genre=>{
        let selectedListItem = genreList.querySelector(`input[value="${genre}"]`);
        selectedListItem.checked = false;
    })
    selectedGenreId = [];
    selectedGenreNames = [];
    rerenderPopularMovies();
};

export function initGenreFilter(genreData){
    populateGenre(genreData);
    genreList.addEventListener('change',(event)=>{
        const listItem = event.target.closest('li');
        const itemCheckBox = listItem.querySelector('input');
        if(itemCheckBox.checked){ //inserting
            updateSelectedGenreList(true,itemCheckBox.value,itemCheckBox.name);
        }else{ //deleting
            updateSelectedGenreList(false,itemCheckBox.value,itemCheckBox.name);
        }
    })
}