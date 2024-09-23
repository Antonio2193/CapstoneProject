import express from 'express';
import { getAnime, createAnime, getSingleAnime, editAnime, deleteAnime } from '../controllers/anime.controller.js';
import { getManga, createManga, getSingleManga, editManga, deleteManga } from '../controllers/manga.controller.js';
import uploadCloudinary from '../middleware/uploadCloudinary.js';

const router = express.Router();
router.get('/anime', getAnime) // /api/v1/anime

router.post('/anime', uploadCloudinary.single('cover'), createAnime)

router.get('/anime/:id', getSingleAnime)

router.put('/anime/:id', editAnime)

router.delete('/anime/:id', deleteAnime)

/* router.patch('/:blogPostId/cover', uploadCloudinary.single('cover'), patchPost) */

router.post('/manga',uploadCloudinary.single('cover'), createManga)
router.get('/manga', getManga)
router.get('/manga/:id', getSingleManga)
router.put('/manga/:id', editManga);
router.delete('/manga/:id', deleteManga);


export default router