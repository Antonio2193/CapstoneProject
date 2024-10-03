import express from 'express';
import { createAnime, getAnime, getSingleAnime, deleteAnime } from '../controllers/anime.controller.js';
import { createManga, getManga, getSingleManga, deleteManga } from '../controllers/manga.controller.js';
import uploadCloudinary from '../middleware/uploadCloudinary.js';

const router = express.Router();

// Anime routes
router.get('/anime', getAnime);
router.post('/anime', uploadCloudinary.single('cover'), createAnime);
router.get('/anime/:id', getSingleAnime);
router.delete('/anime/:id', deleteAnime);

// Manga routes
router.get('/manga', getManga);
router.post('/manga', uploadCloudinary.single('cover'), createManga);
router.get('/manga/:id', getSingleManga);
router.delete('/manga/:id', deleteManga);

export default router;
