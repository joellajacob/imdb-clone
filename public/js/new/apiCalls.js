export const searchMovieAPI = async(query,handleDisplaySection)=>{
    try {
        const response = await axios.get('/movie/search',{
            params: {
                query: query
            }});
        const result = response.data;
        handleDisplaySection(result,query,'search');
    } catch (error) {
        throw error;
    }   
}

export const filterAPI = async (initFilters) =>{ 
    try {
        const response = await axios.get('/api/genres');
        const genreData = response.data;
        initFilters({genreData});
        // populateFilterPanel({genreData});
    } catch (error) {
        throw error;
        // dispError(error.response.data.message,'filter');
    }
}

export const searchMoviesWithFilter = async(withGenres,query,handleDisplaySection) =>{
    try {
        const response = await axios.get('/api/discover',{
            params:{
                with_genres: withGenres
            }});
            const result = response.data;
        handleDisplaySection(result,query,'filter');
    } catch (error) {
        throw error;
    }
}