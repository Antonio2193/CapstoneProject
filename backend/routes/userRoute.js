import express from 'express';
import { getUsers, createUser, getSingleUser, editUser, deleteUser, patchUser } from '../controllers/user.controller.js';
import uploadCloudinary from '../middleware/uploadCloudinary.js';
import User from '../models/userSchema.js';


const router = express.Router();

// Rotta per cercare utenti per nome o email
// Rotta per cercare utenti per nome o email
router.get('/search', async (req, res) => {
    const { query } = req.query; // Otteniamo la query di ricerca dal parametro 'query'

    if (!query) {
        return res.status(400).json({ message: 'Query di ricerca non fornita' });
    }

    try {
        const users = await User.find({
            $or: [
                { name: { $regex: query, $options: 'i' } }, // Ricerca per nome
                { email: { $regex: query, $options: 'i' } } // Ricerca per email
            ]
        }).select('_id name email avatar'); // Restituiamo solo campi rilevanti
        
        res.status(200).json(users);
    } catch (error) {
        console.error("Errore nella ricerca degli utenti:", error); // Log dell'errore sul terminale
        res.status(500).json({ message: 'Errore nella ricerca degli utenti' });
    }
});


router.get('/', getUsers) // /api/v1/users

router.post('/', uploadCloudinary.single('avatar'), createUser)

router.get('/:id', getSingleUser)


router.put('/:id', editUser)

router.delete('/:id', deleteUser)

router.patch('/:userId/avatar', uploadCloudinary.single('avatar'), patchUser)

// Rotta per cercare utenti per nome o email
router.get('/search', async (req, res) => {
    const { query } = req.query; // Otteniamo la query di ricerca dal parametro 'query'

    if (!query) {
        return res.status(400).json({ message: 'Query di ricerca non fornita' });
    }

    try {
        const users = await User.find({
            $or: [
                { name: { $regex: query, $options: 'i' } }, // Ricerca per nome
                { email: { $regex: query, $options: 'i' } } // Ricerca per email
            ]
        }).select('_id name email avatar'); // Restituiamo solo campi rilevanti (puoi aggiungere campi se necessario)
        
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Errore nella ricerca degli utenti' });
    }
});

export default router