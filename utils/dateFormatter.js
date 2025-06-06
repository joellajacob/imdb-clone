function dateFormat(inp){

    if(!inp){
        return '';
    }

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const inpDate = inp.includes('T') ? inp.split('T')[0].toString() : inp;
    const date = new Date(inpDate);

    if(isNaN(date.getTime())){ //if invalid parsing
        return '';
    }

    let month = months[date.getMonth()];
    let year = date.getFullYear();
    let day = date.getDate();

    return `${day} ${month} ${year}`;  
}

export default dateFormat;