import User from "../models/userSchema.js";

export const getUsers = async (req, res) => {
    const page = req.query.page || 1
    let perPage = req.query.perPage || 8
    perPage = perPage > 10 ? 8 : perPage
    try {
        const users = await User.find(req.query.name ? {name: {$regex: req.query.name, $options: "i"}}:{}).
        collation({locale: 'it'}) // Ignora maiuscole e minuscole nell'ordinamento
        .sort({ name: 1, surname: 1 })
        .skip((page - 1) * perPage)
        .limit(perPage);
        
        const totalResults = await User.countDocuments(); // Totale documenti
        const totalPages = Math.ceil(totalResults / perPage);
        
        res.send({
            dati: users,
            page,
            totalPages,
            totalResults,
        });
    } catch (error) {
        res.status(404).send({ message: "Users not found" });
    }
}

export const createUser = async (req, res) => {
    const user = new User(req.body);
    user.avatar = user.avatar ? user.avatar : "https://picsum.photos/40";
    try {
        const newUser = await user.save();
        res.status(200).send(newUser);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
}

export const getSingleUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        res.status(200).send(user);
    } catch (error) {
        res.status(404).send({ message: "User not found" });
    }   
}

export const editUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByIdAndUpdate(id, req.body, { new: true });
        user.avatar = user.avatar ? user.avatar : "https://picsum.photos/40";
        await user.save();
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
}

export const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        if (await User.exists({ _id: id })) {
            await User.findByIdAndDelete(id);
            res.status(200).send({ message: `User ${id} has been deleted` });
        } else {
            res.status(400).send({ message: `User ${id} not found` });
        }
    } catch (error) {
        res.status(400).send({ message: `User ${id} not found` });
    }
}

export const patchUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findByIdAndUpdate(userId, { avatar: req.file.path }, { new: true });
        await user.save();
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
}



