const mainSection = document.querySelector('main');
const searchErrorDiv = document.querySelector('.search-error-container');
const filterErrorDiv = mainSection.querySelector('.filter-error-container')
const serverErrorDiv = mainSection.querySelector('.server-error-container');
const serverMsgDiv = searchErrorDiv.querySelector('.server-msg-container');

export const dispError = (msg,field)=>{
    if(field==='query'){ //client search validation
        searchErrorDiv.innerText = msg;
        searchErrorDiv.classList.remove('hidden');
    }else if(field ==='filter'){
        filterErrorDiv.innerText = msg;
        filterErrorDiv.classList.remove('hidden');
    }
    else if(field === 'server' || field === 'network'){ //server validation
        const p = serverMsgDiv.querySelector('p');
        p.innerText = msg;
        serverErrorDiv.classList.remove('hidden');    
    }
};

export const clearErrors = ()=>{

    // filterErrorDiv.innerText = searchErrorDiv.innerText = otherErrorMsg.innerText = '';
    searchErrorDiv.classList.add('hidden');
    // filterErrorDiv.classList.add('hidden');
    // emptyErrorDiv.classList.add('hidden');
    serverErrorDiv.classList.add('hidden');
};
