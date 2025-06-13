import { tmdbApi } from '../services/tmdbService.js';
import { listFormat, contentFormat} from '../utils/textFormatter.js';
import dateFormat from '../utils/dateFormatter.js';
import appError from '../utils/appError.js';
import tmdbErrorMap from '../utils/tmdbErrorMapping.js';
import envConfig from '../config/envConfig.js';
import popularMovies from '../data/mockdata.js';


const movieController = {
    getPopularMovies: async(req,res,next)=>{
        try {
            // const {data: popularMovies}  = await tmdbApi.get('/movie/popular');
            const formattedMovies = popularMovies.results.map(movie=>({
                ...movie,
                formattedRating: movie.vote_average.toFixed(1)
            }))
            res.render('index',{pageTitle: 'IMDB | HomePage', movies: formattedMovies, baseImgURL: envConfig.tmdbBaseImgURL});
        } catch (error) {
            const tmdbError = tmdbErrorMap(error);
            next(tmdbError);
        }},
    getMovieDetails: async (req,res,next)=>{
        try {
            if(!req.params.id){
                throw appError('Movie ID does not exist',404,'INVALID_ID','id');
            }
            //fetching from API
            const {data:movie} = await tmdbApi.get(`/movie/${req.params.id}`);
            const {data:reviews} = await tmdbApi.get(`/movie/${req.params.id}/reviews`);
            const {data:credits} = await tmdbApi.get(`movie/${req.params.id}/credits`);
            const {data:videoData} = await tmdbApi.get(`/movie/${req.params.id}/videos`);
            //fetching required data from each response
            const videos = videoData.results;
            const trailer = videos.length>0 ? videos.find(video => video.type.toLowerCase() ==='trailer' && video.site.toLowerCase() === 'youtube'):null;
            const castData = credits.cast;
            const mainCast = castData.filter(cast =>{ 
                return cast.known_for_department.toLowerCase() === 'acting' && cast.order <6;
            })
            const crewData = credits.crew;
            const mainDirectors = crewData.filter(crew =>{
                return crew.department.toLowerCase() === 'directing' && (crew.job.toLowerCase() === 'director' || crew.job.toLowerCase() === 'co-director');
            });
            const mainWriters = crewData.filter(crew =>{
                return crew.department.toLowerCase() === 'writing' && (crew.job.toLowerCase() === 'writer' || crew.job.toLowerCase() === 'screenplay' || crew.job.toLowerCase() === 'dialogue');
            });
            //formatting
            const voteAvg = movie.vote_average.toFixed(1);
            const formattedReleaseDate = dateFormat(movie.release_date);
            const formattedReviews = reviews.results.map(review =>({
                ...review,
                formattedCreatedDate: dateFormat(review.created_at),
                truncatedContent : contentFormat(review.content,200)
            }));
            //truncating
            const truncatedLang = listFormat(movie.spoken_languages,'english_name',3);
            const truncatedGenre = listFormat(movie.genres,'name',7);
            const truncatedProd = listFormat(movie.production_companies,'name',3);
            const truncatedDir = listFormat(mainDirectors,'name',3);
            const truncatedWriters = listFormat(mainWriters,'name',3);
            res.render('movieDetails',{
                pageTitle: movie.title, movie, mainCast, review: formattedReviews,releaseDate: formattedReleaseDate, voteAvg, langList: truncatedLang, genreList: truncatedGenre, prodList: truncatedProd, dirList: truncatedDir,writerList: truncatedWriters, trailerKey: trailer? trailer.key:null, baseImgURL: envConfig.tmdbBaseImgURL, baseYoutubeURL: envConfig.youtubeBaseURL
            });
        } catch (error) {
            if(error.field){
                return next(error);
            }
            const tmdbError = tmdbErrorMap(error);
            next(tmdbError);
        }},
    searchMovies: async (req,res,next)=>{
        try {
            let query = req.query.query;
            if(typeof query !== 'string'){
                throw appError('Search query must be a string',400,'INVALID_TYPE','query');
            }
            query = query.trim();
            //validations
            if(!query){
                throw appError('Search query missing',400,'MISSING_QUERY','query');
            }
            if(query.length<3 || query.length>18){
                throw appError('Search query must be between 3 and 18 characters long',400,'INVALID_LENGTH','query');
            }
            const response = await tmdbApi.get('/search/movie',{
                params : {
                    query: query
                }});
            const data = response.data.results;
            const formattedMovies = data.map(movie=>({
                ...movie,
                formattedRating: movie.vote_average.toFixed(1)
            }))
            res.json({
                    baseImgURL : envConfig.tmdbBaseImgURL,
                    data: formattedMovies
                });
        } catch (error) {
            if(error.field){
                return next(error); //return --> to prevent exe of succeeding lines
            }
            const tmbdError = tmdbErrorMap(error);
            next(tmbdError);
        }}
};

export default movieController;