import UserLibrary from '../models/userLibrarySchema.js';

export const getUserLibrary = async (req, res) => {
    const currentUserId = req.loggedUser._id; // ID dell'utente loggato
    const targetUserId = req.params.userId; // ID dell'utente di cui vogliamo recuperare la libreria

    try {
        const userAnimeEntries = await UserLibrary.find({ userId: targetUserId, type: 'anime' }).populate('animeId');
        const userMangaEntries = await UserLibrary.find({ userId: targetUserId, type: 'manga' }).populate('mangaId');

        const userLibrary = {
            anime: userAnimeEntries.map(entry => {
                
                // Verifica se animeId è definito
                if (!entry.animeId) {
                    console.log('AnimeId non trovato per questa entry.');
                    return null; // O gestisci l'errore in altro modo
                }

                // Verifica se l'ID dell'utente è uguale
                if (entry.isPrivate && entry.userId.toString() !== currentUserId.toString()) {
                    console.log(`Anime ${entry.animeId.title} non mostrato, è privato.`);
                    return null; // Non mostrare l'elemento se è privato e non di proprietà
                }
                return {
                    ...entry.animeId._doc,
                    _id: entry._id, // id dell'UserLibrary entry
                    isPrivate: entry.isPrivate,
                };
            }).filter(entry => entry !== null), // Filtra i nulli

            manga: userMangaEntries.map(entry => {
                
                // Verifica se mangaId è definito
                if (!entry.mangaId) {
                    console.log('MangaId non trovato per questa entry.');
                    return null; // O gestisci l'errore in altro modo
                }

                // Verifica se l'ID dell'utente è uguale
                if (entry.isPrivate && entry.userId.toString() !== currentUserId.toString()) {
                    console.log(`Manga ${entry.mangaId.title} non mostrato, è privato.`);
                    return null; // Non mostrare l'elemento se è privato e non di proprietà
                }
                return {
                    ...entry.mangaId._doc,
                    _id: entry._id, // id dell'UserLibrary entry
                    isPrivate: entry.isPrivate,
                };
            }).filter(entry => entry !== null), // Filtra i nulli
        };

        res.status(200).json(userLibrary);
    } catch (error) {
        console.error("Errore:", error); // Log dell'errore
        res.status(500).json({ message: error.message });
    }
};

// Funzione per aggiungere anime alla libreria
export const addAnimeToLibrary = async (req, res) => {
    const userId = req.params.userId;
    const { animeId } = req.body;

    try {
        // Controlla se l'anime è già nella libreria dell'utente
        const existingEntry = await UserLibrary.findOne({ userId, animeId, type: 'anime' });
        if (existingEntry) {
            return res.status(400).json({ errorCode: 'ANIME_ALREADY_IN_LIBRARY', message: 'Anime già presente nella libreria' });
        }

        const newEntry = new UserLibrary({ userId, animeId, type: 'anime' });
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
        const existingEntry = await UserLibrary.findOne({ userId, mangaId, type: 'manga' });
        if (existingEntry) {
            return res.status(400).json({ errorCode: 'MANGA_ALREADY_IN_LIBRARY', message: 'Manga già presente nella libreria' });
        }

        const newEntry = new UserLibrary({ userId, mangaId, type: 'manga' });
        await newEntry.save();
        res.status(201).json({ message: 'Manga aggiunto alla libreria' });
    } catch (error) {
        console.error('Errore durante l\'aggiunta di un manga alla libreria:', error);
        res.status(500).json({ errorCode: 'INTERNAL_ERROR', message: 'Errore durante l\'aggiunta del manga alla libreria' });
    }
};

// Funzione per aggiornare la privacy di un elemento nella libreria
export const updatePrivacy = async (req, res) => {
    const userId = req.params.userId; // ID dell'utente
    const itemId = req.params.itemId; // _id dell'oggetto UserLibrary
    const isPrivate = req.body.isPrivate; // Dovrebbe essere un booleano

    try {
        const updatedEntry = await UserLibrary.findByIdAndUpdate(
            itemId,
            { isPrivate: isPrivate }, // Assicurati che sia booleano
            { new: true } // Restituisce il documento aggiornato
        );

        if (!updatedEntry) {
            return res.status(404).json({ message: "Elemento non trovato" });
        }

        res.status(200).json(updatedEntry);
    } catch (error) {
        console.error("Errore nell'aggiornamento della privacy:", error);
        res.status(500).json({ message: "Errore nell'aggiornamento della privacy" });
    }
};

// Funzione per eliminare un anime o manga dalla libreria
export const deleteFromLibrary = async (req, res) => {
    const userId = req.params.userId; // ID dell'utente
    const itemId = req.params.itemId; // ID dell'elemento della UserLibrary da eliminare

    try {
        const deletedEntry = await UserLibrary.findOneAndDelete({
            _id: itemId,
            userId: userId
        });

        if (!deletedEntry) {
            return res.status(404).json({ message: "Elemento non trovato" });
        }

        res.status(200).json({ message: "Elemento rimosso dalla libreria" });
    } catch (error) {
        console.error("Errore nell'eliminazione dell'elemento:", error);
        res.status(500).json({ message: "Errore nell'eliminazione dell'elemento" });
    }
};



