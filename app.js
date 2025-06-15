import express from 'express';
import envConfig from './config/envConfig.js';
import  { movieRouter } from './routes/movieRoutes.js';
import { filterRouter } from './routes/filterRoutes.js';
import movieController from './controllers/movieController.js';

const PORT = envConfig.port;

//instance - express
const app = express();

//view engine
app.set('view engine','ejs');

//middleware
app.use(express.static('public'));
app.use('/movie',movieRouter);
app.use('/api',filterRouter);


//route handlers
// app.get('/',movieController.getPopularMovies);
app.get('/',(req,res)=>{
    res.render('example.ejs');
})

app.use((err,req,res,next)=>{
    // 1.when working with API, json is better to send response
    // 2. err.response --> api's message
    // 3. err.message --> network error / error thrown from within code
    console.error(err.status,err.message,err.code);    
    const httpStatus = err.status || 500;
    // if(err.request){

    // }
    res.status(httpStatus).json({
        message: err.message || 'An unexpected server error occurred. Please try again later.',
        field: err.field || 'server'
    })
})

app.listen(PORT,()=>{
    console.log(`Server running on localhost:${PORT}.`);    
});