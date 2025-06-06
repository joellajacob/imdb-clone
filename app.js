import express from 'express';
import envConfig from './config/envConfig.js';
import { tmdbApi } from './services/tmdbService.js';
import  { movieRouter } from './routes/movieRoutes.js';
import movieController from './controllers/movieController.js';

const PORT = envConfig.port;

//instance - express
const app = express();

//view engine
app.set('view engine','ejs');

//middleware
app.use(express.static('public'));
app.use('/movie',movieRouter);


//route handlers
app.get('/',movieController.getPopularMovies);

//receive genre list to add in filter (client-side JS)
app.get('/api/genres',async (req,res,next)=>{
    try {
        const response = await tmdbApi.get('/genre/movie/list');
        const data = response.data;
        res.json(data);
    } catch (error) {
        next(error);
    }
});

//to retrieve movies based on filters
app.get('/api/discover', async (req,res,next)=>{
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
})
app.use((err,req,res,next)=>{
    // 1.when working with API, json is better to send response
    // 2. err.response --> api's message
    // 3. err.message --> network error / error thrown from within code
    console.error(err.status,err.message,err.code);    
    const httpStatus = err.status || 500;
    res.status(httpStatus).json({
        message: err.message || 'An unexpected server error occurred. Please try again later.',
        field: err.field || undefined
    })
})

app.listen(PORT,()=>{
    console.log(`Server running on localhost:${PORT}.`);    
});