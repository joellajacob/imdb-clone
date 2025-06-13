export const searchMovieAPI = async(query,handleDisplaySection)=>{
    try {
        const response = await axios.get('/movie/search',{
            params: {
                query: query
            }});
        const result = response.data;
        handleDisplaySection(result,query,'search');
        // dispMovies(result,`Search Results for "${query}"`,'search');
    } catch (error) {
        throw error;
    }   
}