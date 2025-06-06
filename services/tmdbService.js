import axios from 'axios';
import envConfig from '../config/envConfig.js';

export const tmdbApi = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    params:{
        api_key: envConfig.tmdbAPIKey,
        language: 'en-US'
    }
});