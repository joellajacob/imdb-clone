import {Router} from "express";
import movieController from "../controllers/movieController.js";

const router = Router();

router.get('/search',movieController.searchMovies);
router.get('/:id',movieController.getMovieDetails);

export const movieRouter = router;