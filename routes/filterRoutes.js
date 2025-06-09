import {Router} from 'express';
import filterController from '../controllers/filterController.js';

const router = Router();

router.get('/genres',filterController.getGenres);
router.get('/discover',filterController.searchMoviesByFilter);


export const filterRouter = router;