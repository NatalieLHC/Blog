import express from 'express';
import authenticateToken from '../middleware/authenticateToken.js';
import {createPosts,
        getPostById,
        getPosts,
        updatePost,
        uploadImage,
        deletePost} from "../controller/post.controller.js";

const postRouter = express.Router();

postRouter.post('/',authenticateToken, uploadImage,createPosts);
postRouter.get('/:id',getPostById);
postRouter.get('/', getPosts);
postRouter.put('/:id', authenticateToken, updatePost);
postRouter.delete('/:id', authenticateToken,deletePost);


export default postRouter;