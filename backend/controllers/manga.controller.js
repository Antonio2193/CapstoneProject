import Manga from "../models/mangaSchema.js";
import {v2 as cloudinary} from 'cloudinary';

export const getManga = async (req, res) => {
    try {
        const query = req.query.title ? { title: { $regex: req.query.title, $options: "i" } } : {};
        
        const manga = await Manga.find(query)
            .collation({ locale: 'it' }) // Ignora maiuscole e minuscole nell'ordinamento
            .sort({ title: 1, author: 1 }) // Ordina per titolo e autore
            .exec();

        res.send({
            dati: manga,
            totalResults: manga.length, // Totale risultati
        });
    } catch (error) {
        console.error('Error fetching manga:', error);
        res.status(404).send({ message: "Manga not found" });
    }
};

export const getSingleManga = async(req,res) => {
    const { id } = req.params;
    try {
        const manga = await Manga.findById(id);
        res.status(200).send(manga);
    } catch (error) {
        res.status(404).send({ message: "Manga not found" });
    }
}

export const createManga = async (req, res) => {
    try {
        console.log("req.body:", req.body); // Verifica i dati nel body
        console.log("req.file:", req.file); // Verifica il file caricato

        let coverPath;

        // Verifica se viene fornito un URL per l'immagine o se c'è un file caricato
        if (req.body.cover) {
            coverPath = req.body.cover;
        } else if (req.file) {
            coverPath = req.file.path;
        } else {
            coverPath = 'https://via.placeholder.com/150'; // Immagine di fallback
        }

        const manga = new Manga({ ...req.body, cover: coverPath });
        const newManga = await manga.save();

        res.status(201).send(newManga);
    } catch (error) {
        console.error("Errore nella creazione del manga:", error);
        res.status(400).send({ message: "Errore nella creazione del manga" });
    }
};

export const editManga = async(req,res) => {
    const { id } = req.params;
    try {
        const manga = await Manga.findByIdAndUpdate(id, req.body, {new: true});
        manga.cover = manga.cover ? manga.cover : "https://picsum.photos/200/300/";
        await manga.save();

        res.send(manga);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
}

export const deleteManga = async(req,res) => {
    const { id } = req.params;
    try {
        if (await Manga.exists({_id: id})){
            await Manga.findByIdAndDelete(id);
            res.status(200).send({message: `Manga ${id} has been deleted`});
        }else{
            res.status(400).send({ message: `Manga ${id} not found`});
        }
    } catch (error) {
        res.status(400).send({ message: `Manga ${id} not found`});
    }
}
