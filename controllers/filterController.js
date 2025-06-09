import { tmdbApi } from "../services/tmdbService.js";
import appError from "../utils/appError.js";
import tmdbErrorMap from "../utils/tmdbErrorMapping.js";

const filterController = {
    getGenres: async (req,res,next)=>{
        try {
            const response = await tmdbApi.get('/genre/movie/list');
            const data = response.data;
            res.json(data.genres);
        } catch (error) {
            const tmdbError = tmdbErrorMap(error);
            next(tmdbError);
        }
    },
    searchMoviesByFilter: async (req,res,next)=>{
        try {
            const response = await tmdbApi.get('/discover/movie',{
                params:{
                    with_genres: req.query.with_genres, //multiple genres sep by ','
                    sort_by: `popularity.desc`                              
                }});
            const data = response.data;
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
};

export default filterController;