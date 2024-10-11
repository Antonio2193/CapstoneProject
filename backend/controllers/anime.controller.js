import Anime from "../models/animeSchema.js";
import { v2 as cloudinary } from 'cloudinary'; 

export const getAnime = async (req, res) => {
    try {
        const query = req.query.title ? { title: { $regex: req.query.title, $options: "i" } } : {};
        
        const anime = await Anime.find(query)
            .collation({ locale: 'it' }) // Ignora maiuscole e minuscole nell'ordinamento
            .sort({ title: 1, producer: 1 }) // Ordina per titolo e produttore
            .exec();

        res.send({
            dati: anime,
            totalResults: anime.length, // Totale risultati
        });
    } catch (error) {
        console.error('Error fetching anime:', error);
        res.status(404).send({ message: "Anime not found" });
    }
};

export const getSingleAnime = async(req,res) => {
    const { id } = req.params;
    try {
        const anime = await Anime.findById(id);
        res.status(200).send(anime);
    } catch (error) {
        res.status(404).send({ message: "Anime not found" });
    }
}

export const createAnime = async (req, res) => {
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
            coverPath = 'https://via.placeholder.com/150';
        }

        const anime = new Anime({ ...req.body, cover: coverPath });
        const newAnime = await anime.save();

        res.status(201).send(newAnime);
    } catch (error) {
        console.error("Errore nella creazione dell'anime:", error);
        res.status(400).send({ message: "Errore nella creazione dell'anime" });
    }
};


export const editAnime = async(req,res) => {
    const { id } = req.params;
    try {
        const anime = await Anime.findByIdAndUpdate(id, req.body, {new: true});
        anime.cover = anime.cover ? anime.cover : "https://picsum.photos/200/300/";
        await anime.save();

        res.send(anime);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
}

export const deleteAnime = async(req,res) => {
    const { id } = req.params;
    try {
        if (await Anime.exists({_id: id})){
            await Anime.findByIdAndDelete(id);
            res.status(200).send({message: `Anime ${id} has been deleted`});
        }else{
            res.status(400).send({ message: `Anime ${id} not found`});
        }
    } catch (error) {
        res.status(400).send({ message: `Anime ${id} not found`});
    }
}
