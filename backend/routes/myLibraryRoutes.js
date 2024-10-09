import express from 'express';
import { getUserLibrary, addAnimeToLibrary, addMangaToLibrary, updatePrivacy, deleteFromLibrary } from '../controllers/myLibrary.controller.js';
import authorization from '../middleware/authorization.js';

const router = express.Router();

router.use(authorization);


// Ottieni la libreria personale dell'utente
router.get('/user/:userId/myLibrary', getUserLibrary);

// Aggiungi anime e manga alla libreria personale
router.post('/user/:userId/anime', addAnimeToLibrary);
router.post('/user/:userId/manga', addMangaToLibrary);

// Modifica la privacy di un elemento nella libreria
router.patch('/user/:userId/myLibrary/:itemId/privacy', updatePrivacy);

// Elimina un elemento dalla libreria personale
router.delete('/user/:userId/myLibrary/:itemId', deleteFromLibrary);

export default router;
