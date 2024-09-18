import express from 'express';
import { getPosts, createPost, getSinglePost, editPost, deletePost, patchPost } from '../controllers/post.controller.js';
import { getComments, createComment, getSingleComment, editComment, deleteComment } from '../controllers/comment.controller.js';
import uploadCloudinary from '../middleware/uploadCloudinary.js';

const router = express.Router();
router.get('/', getPosts )

router.post('/', uploadCloudinary.single('cover'), createPost)

router.get('/:id', getSinglePost)

router.put('/:id', editPost)

router.delete('/:id', deletePost)

router.patch('/:blogPostId/cover', uploadCloudinary.single('cover'), patchPost)

router.post('/:postId/comments', createComment)
router.get('/:postId/comments', getComments)
router.get('/:postId/comments/:commentId', getSingleComment)
router.put('/:postId/comment/:commentId', editComment);
router.delete('/:postId/comment/:commentId', deleteComment);


export default router