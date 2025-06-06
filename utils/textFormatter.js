export function listFormat(arr,key,limit){
    let list = arr.map(ele => {return ele[key]});
    let originalList = list;
    let truncated = false;
    if(list.length>limit){
        list = list.slice(0,limit);
        truncated = true;
    }
    return {original: originalList, new: list, trunc: truncated} ;
}

export function contentFormat(str,limit){
    let truncated = false;
    if(str.length>limit){
        let index = str.slice(0,limit).lastIndexOf(" ");
        str = str.slice(0,index);
        truncated = true;
    }
    return {new: str, trunc: truncated};
}
