import express from 'express';
import { getUsers, createUser, getSingleUser, editUser, deleteUser, patchUser } from '../controllers/user.controller.js';
import uploadCloudinary from '../middleware/uploadCloudinary.js';


const router = express.Router();
router.get('/', getUsers) // /api/v1/users

router.post('/', uploadCloudinary.single('avatar'), createUser)

router.get('/:id', getSingleUser)

router.put('/:id', editUser)

router.delete('/:id', deleteUser)

router.patch('/:userId/avatar', uploadCloudinary.single('avatar'), patchUser)

export default router