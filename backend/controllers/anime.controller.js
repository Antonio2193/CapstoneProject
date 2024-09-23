import Anime from "../models/animeSchema.js";

export const getAnime = async(req,res) => {
    const page = req.query.page || 1;
    let perPage = req.query.perPage || 8;
    perPage = perPage > 10 ? 9 : perPage;

    try {
        const anime = await Anime.find(req.query.title ? { title: { $regex: req.query.title, $options: "i" } } : {})
        .collation({ locale: 'it' }) // Ignora maiuscole e minuscole nell'ordinamento
        .sort({ title: 1, author: 1 })
        .skip((page - 1) * perPage)
        .limit(perPage)
        .exec();

        const totalResults = await Anime.countDocuments(req.query.title ? { title: { $regex: req.query.title, $options: "i" } } : {});
        const totalPages = Math.ceil(totalResults / perPage);

        res.send({
            dati: anime,
            page,
            totalPages,
            totalResults,
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

export const createAnime = async(req,res) => {
    const anime = new Anime({...req.body, cover: req.file.path});
    let newAnime;
    try {
       newAnime = await anime.save();
        res.send(anime);
    } catch (error) {
        res.status(400).send(error);
    }
}

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