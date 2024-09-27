import Post from "../models/postSchema.js";
import User from "../models/userSchema.js";


export const getPosts = async (req, res) => {
    const page = req.query.page || 1;
    let perPage = req.query.perPage || 8;
    perPage = perPage > 10 ? 9 : perPage;

    try {
        // Filtro opzionale per il titolo
        const filter = req.query.title ? { title: { $regex: req.query.title, $options: "i" } } : {};

        // Trova i post, ordina per titolo e categoria, applica paginazione
        const posts = await Post.find(filter)
            .collation({ locale: 'it' }) // Ignora maiuscole e minuscole
            .sort({ title: 1, category: 1 })
            .skip((page - 1) * perPage)
            .limit(perPage)
            .populate({
                path: 'comments', // Popola i commenti collegati
                populate: { path: 'author', select: 'name' } // Popola anche il campo 'author' dei commenti con solo il nome
            })
            .exec();

        // Conta il totale dei post
        const totalResults = await Post.countDocuments(filter);
        const totalPages = Math.ceil(totalResults / perPage);

        // Risposta con i dati dei post, numero di pagine, ecc.
        res.send({
            dati: posts,
            page,
            totalPages,
            totalResults,
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(404).send({ message: "Posts not found" });
    }
};



export const createPost = async (req, res) => {
    const post = new Post({...req.body, cover: req.file.path});
    let newPost 
    try {
        newPost = await post.save();
        res.send(newPost)
    } catch (error) {
        return res.status(400).send({ message: error.message });
    }
}

export const getSinglePost = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Post.findById(id)/* .populate('user') */;
        res.status(200).send(post);
    } catch (error) {
        res.status(404).send({ message: "Post not found" });
    }   
}


export const editPost = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Post.findByIdAndUpdate(id, req.body , {new: true});
        post.cover = post.cover ? post.cover : "https://picsum.photos/200/300";
        await post.save();

        res.status(200).send(post);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
}

export const deletePost = async (req, res) => {
    const { id } = req.params;
    try{
        if (await Post.exists({_id: id})){
            await Post.findByIdAndDelete(id);
            res.status(200).send({message: `Post ${id} has been deleted`});
        }else{
            res.status(400).send({ message: `Post ${id} not found` });
        }
    } catch (error) {
        res.status(400).send({ message: `Post ${id} not found` });
    }
}

export const patchPost = async (req, res) => {
    const { blogPostId } = req.params;
    try {
        const post = await Post.findByIdAndUpdate(blogPostId, {cover: req.file.path}, {new: true});
        await post.save();
        res.status(200).send(post);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
}