import Manga from "../models/mangaSchema.js";

export const getManga = async(req,res) => {
    const page = req.query.page || 1;
    let perPage = req.query.perPage || 8;
    perPage = perPage > 10 ? 9 : perPage;

    try {
        const manga = await Manga.find(req.query.title ? { title: { $regex: req.query.title, $options: "i" } } : {})
        .collation({ locale: 'it' }) // Ignora maiuscole e minuscole nell'ordinamento
        .sort({ title: 1, author: 1 })
        .skip((page - 1) * perPage)
        .limit(perPage)
        .exec();

        const totalResults = await Manga.countDocuments(req.query.title ? { title: { $regex: req.query.title, $options: "i" } } : {});
        const totalPages = Math.ceil(totalResults / perPage);

        res.send({
            dati: manga,
            page,
            totalPages,
            totalResults,
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

export const createManga = async (req,res) => {
    const manga = new Manga({...req.body, cover: req.file.path});
    let newManga;
    try {
        newManga = await manga.save();
        res.send(newManga);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
}

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