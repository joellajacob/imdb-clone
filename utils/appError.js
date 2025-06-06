function appError(message, status, code, field){
    const err = new Error(message);
    err.status = status;
    err.field = field; //field is to idenitfy which form caused error (used normally only for client side)
    err.code = code;
    return err;
}

export default appError;