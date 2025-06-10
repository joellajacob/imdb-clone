const dispSection = document.querySelector('.display-container');
const searchErrorDiv = document.querySelector('.search-error-msg');
const filterErrorDiv = document.querySelector('.filter-error-msg')
const otherErrorMsg = dispSection.querySelector('.additional-error-msg');

export const dispError = (msg,field)=>{
    if(field==='query'){ //client search validation
        searchErrorDiv.innerText = msg;
    }else if(field ==='filter'){
        filterErrorDiv.innerText = msg;
    }
    else{ //server validation or empty search
        otherErrorMsg.innerText = msg;
    }
};

export const clearErrors = ()=>{
    filterErrorDiv.innerText = searchErrorDiv.innerText = otherErrorMsg.innerText = '';
};