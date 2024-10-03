import express from 'express';
import { getUserLibrary, addAnimeToLibrary, addMangaToLibrary } from '../controllers/myLibrary.controller.js';

const router = express.Router();

// Ottieni la libreria personale dell'utente
router.get('/user/:userId/myLibrary', getUserLibrary); // Ottieni la libreria dell'utente

// Aggiungi anime alla libreria personale
router.post('/user/:userId/anime', addAnimeToLibrary); // Aggiungi anime alla libreria

// Aggiungi manga alla libreria personale
router.post('/user/:userId/manga', addMangaToLibrary); // Aggiungi manga alla libreria

export default router;
