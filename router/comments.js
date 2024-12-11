import express from "express";
import authenticateToken from "../middleware/authenticateToken.js";
import {createComment} from "../controller/comments.controller.js";
const commentRouter = express.Router();

commentRouter.post('/', authenticateToken, createComment);

export default commentRouter;