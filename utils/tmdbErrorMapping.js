import appError from "./appError.js";

function tmdbErrorMap(error){
    if(error.response){ //error sent from TMDB
        const status = error.response.status;
        switch (status){
            case 401:   //unauthorisation (bad API key --> my server's fault)
                        return appError('Server Configuration Error: Unable to authenticate with the movie database. Please try again later.',500,'SERVER_CONFIG_ERROR',undefined); 
            case 429:   //rate limiting
                        return appError('Too many requests made to the movie database. Please try again later.',429,'RATE_LIMIT_ERROR',undefined);
            case 500:
            case 501:
            case 502:
            case 503:
            case 504:   //server-side issues
                        return appError('The movie database is experiencing server issues. Please try again later.',status,'TMDB_SERVER_ERROR',undefined);
            default:    //other tmbdAPI issues
                        return appError(`An unexpected error from the movie database occurred: ${error.response.data.status_message} || Unknown Error`,status, 'TMDB_UNEXP_ERROR',undefined);
        }

    }else if(error.request){ //network error (req sent but no response)
        return appError('Error occurred while connecting to the movie database. Please try again later.', 503,'NETWORK_ERROR',undefined);
    }
}

export default tmdbErrorMap;