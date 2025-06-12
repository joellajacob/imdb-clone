const mainSection = document.querySelector('main');
const searchErrorDiv = document.querySelector('.search-error-container');
const filterErrorDiv = mainSection.querySelector('.filter-error-container')
const emptyErrorDiv = mainSection.querySelector('.empty-result-container')
const serverErrorDiv = mainSection.querySelector('.server-error-container');

export const dispError = (msg,field)=>{
    if(field==='query'){ //client search validation
        searchErrorDiv.innerText = msg;
        searchErrorDiv.classList.remove('hidden');
    }else if(field ==='filter'){
        filterErrorDiv.innerText = msg;
        filterErrorDiv.classList.remove('hidden');
    }
    else if(field === 'server' || field === 'network'){ //server validation
        serverErrorDiv.innerText = msg;
        serverErrorDiv.classList.remove('hidden');    
    }else{ //empty result
        let {mainMsg,specificMsg} = msg;
        const h3 = emptyErrorDiv.querySelector('h3');
        const p = emptyErrorDiv.querySelector('p');
        h3.innerText = mainMsg;
        p.innerText = specificMsg;
        emptyErrorDiv.classList.remove('hidden'); 
    }
};

export const clearErrors = ()=>{
    // filterErrorDiv.innerText = searchErrorDiv.innerText = otherErrorMsg.innerText = '';
    searchErrorDiv.classList.add('hidden');
    filterErrorDiv.classList.add('hidden');
    emptyErrorDiv.classList.add('hidden');
    serverErrorDiv.classList.add('hidden');
};
