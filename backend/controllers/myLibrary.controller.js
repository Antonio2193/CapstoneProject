import userLibrarySchema from '../models/userLibrarySchema.js';

// Funzione per ottenere la libreria dell'utente
export const getUserLibrary = async (req, res) => {
    const userId = req.params.userId;

    try {
        // Popola i campi animeId e mangaId con i dati completi dell'anime e manga
        const userAnimeEntries = await userLibrarySchema.find({ userId, type: 'anime' }).populate('animeId');
        const userMangaEntries = await userLibrarySchema.find({ userId, type: 'manga' }).populate('mangaId');

        const userLibrary = {
            anime: userAnimeEntries.map(entry => entry.animeId), // Ottieni i dati completi degli anime
            manga: userMangaEntries.map(entry => entry.mangaId), // Ottieni i dati completi dei manga
        };

        res.status(200).json(userLibrary);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Funzione per aggiungere anime alla libreria
// Funzione per aggiungere anime alla libreria
export const addAnimeToLibrary = async (req, res) => {
    const userId = req.params.userId;
    const { animeId } = req.body;

    try {
        // Controlla se l'anime è già nella libreria dell'utente
        const existingEntry = await userLibrarySchema.findOne({ userId, animeId, type: 'anime' });
        if (existingEntry) {
            return res.status(400).json({ errorCode: 'ANIME_ALREADY_IN_LIBRARY', message: 'Anime già presente nella libreria' });
        }

        const newEntry = new userLibrarySchema({ userId, animeId, type: 'anime' });
        await newEntry.save();
        res.status(201).json({ message: 'Anime aggiunto alla libreria' });
    } catch (error) {
        console.error('Errore durante l\'aggiunta di un anime alla libreria:', error);
        res.status(500).json({ errorCode: 'INTERNAL_ERROR', message: 'Errore durante l\'aggiunta dell\'anime alla libreria' });
    }
};

// Funzione per aggiungere manga alla libreria
export const addMangaToLibrary = async (req, res) => {
    const userId = req.params.userId;
    const { mangaId } = req.body;

    try {
        // Controlla se il manga è già nella libreria dell'utente
        const existingEntry = await userLibrarySchema.findOne({ userId, mangaId, type: 'manga' });
        if (existingEntry) {
            return res.status(400).json({ errorCode: 'MANGA_ALREADY_IN_LIBRARY', message: 'Manga già presente nella libreria' });
        }

        const newEntry = new userLibrarySchema({ userId, mangaId, type: 'manga' });
        await newEntry.save();
        res.status(201).json({ message: 'Manga aggiunto alla libreria' });
    } catch (error) {
        console.error('Errore durante l\'aggiunta di un manga alla libreria:', error);
        res.status(500).json({ errorCode: 'INTERNAL_ERROR', message: 'Errore durante l\'aggiunta del manga alla libreria' });
    }
};
