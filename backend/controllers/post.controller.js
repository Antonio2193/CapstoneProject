import Post from "../models/postSchema.js";
import User from "../models/userSchema.js";

// Funzione per ottenere i post
export const getPosts = async (req, res) => {
    const page = req.query.page || 1;
    let perPage = req.query.perPage || 8;
    perPage = perPage > 10 ? 10 : perPage; // Limita a un massimo di 10 post per pagina

    try {
        // Filtro opzionale per il titolo
        const filter = req.query.title ? { title: { $regex: req.query.title, $options: "i" } } : {};

        // Trova i post, ordina per data di creazione (dal più recente al meno recente) e applica paginazione
        const posts = await Post.find(filter)
            .collation({ locale: 'it' }) // Ignora maiuscole e minuscole
            .sort({ createdAt: -1 }) // Ordina per data, dal più recente
            .skip((page - 1) * perPage)
            .limit(perPage)
            .populate({
                path: 'comments',
                populate: { path: 'author', select: 'name' } // Popola anche il campo 'author' dei commenti
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

// Funzione per creare un post
export const createPost = async (req, res) => {
    const post = new Post({ ...req.body, cover: req.file.path });
    let newPost;
    try {
        newPost = await post.save();
        res.send(newPost);
    } catch (error) {
        return res.status(400).send({ message: error.message });
    }
};

// Funzione per ottenere un singolo post
export const getSinglePost = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Post.findById(id)/* .populate('user') */;
        res.status(200).send(post);
    } catch (error) {
        res.status(404).send({ message: "Post not found" });
    }
};

// Funzione per modificare un post
export const editPost = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Post.findByIdAndUpdate(id, req.body, { new: true });
        post.cover = post.cover ? post.cover : "https://picsum.photos/200/300";
        await post.save();

        res.status(200).send(post);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

// Funzione per eliminare un post
export const deletePost = async (req, res) => {
    const { id } = req.params;
    try {
        if (await Post.exists({ _id: id })) {
            await Post.findByIdAndDelete(id);
            res.status(200).send({ message: `Post ${id} has been deleted` });
        } else {
            res.status(400).send({ message: `Post ${id} not found` });
        }
    } catch (error) {
        res.status(400).send({ message: `Post ${id} not found` });
    }
};

// Funzione per aggiornare la copertura di un post
export const patchPost = async (req, res) => {
    const { blogPostId } = req.params;
    try {
        const post = await Post.findByIdAndUpdate(blogPostId, { cover: req.file.path }, { new: true });
        await post.save();
        res.status(200).send(post);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

export const likePost = async (req, res) => {
    const postId = req.params.id;
    const userId = req.loggedUser._id; // Utilizziamo l'ID dell'utente autenticato

    try {
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Controlla se l'utente ha già messo like
        if (post.likes.userIds.includes(userId)) {
            return res.status(400).json({ message: 'Hai già messo like a questo post.' });
        }

        // Aggiungi l'ID utente all'array dei like
        post.likes.userIds.push(userId);
        post.likes.count += 1; // Incrementa il conteggio dei like
        await post.save();

        return res.status(200).json(post); // Restituisci il post aggiornato
    } catch (error) {
        console.error('Error liking post:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
};
