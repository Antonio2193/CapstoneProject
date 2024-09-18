import Post from "../models/postSchema.js";
/* import transport from "../services/mailService.js"; */
import User from "../models/userSchema.js";


export const getPosts = async (req, res) => {
    const page = req.query.page || 1;
    let perPage = req.query.perPage || 8;
    perPage = perPage > 10 ? 9 : perPage;

    try {
        const posts = await Post.find(req.query.title ? { title: { $regex: req.query.title, $options: "i" } } : {})
            .collation({ locale: 'it' }) // Ignora maiuscole e minuscole nell'ordinamento
            .sort({ title: 1, category: 1 })
            .skip((page - 1) * perPage)
            .limit(perPage)
            .populate('user', 'name avatar') // Popola i campi 'name' e 'avatar' dell'utente
            .exec();

        const totalResults = await Post.countDocuments(req.query.title ? { title: { $regex: req.query.title, $options: "i" } } : {});
        const totalPages = Math.ceil(totalResults / perPage);

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
    const post = new Post({...req.body, cover: req.file.path, readTime:JSON.parse(req.body.readTime)});
    let newPost 
    try {
        newPost = await post.save();
        res.send(newPost)
    } catch (error) {
        return res.status(400).send({ message: error.message });
    }

  /*   try {
        const user = await User.findById(newPost.user);
        await transport.sendMail({
            from: 'noreply@joker.com', // sender address
            to: user.email, // list of receivers
            subject: "New Post", // Subject line
            text: "You have created a new post", // plain text body
            html: "<b>You have created a new post</b>", // html body
        })
    } catch (error) {
        console.log(error)
    } */
}

export const getSinglePost = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Post.findById(id).populate('user');
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