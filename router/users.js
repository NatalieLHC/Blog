import express from 'express';
import { registerUser, loginUser, validateLogin,validateRegistration} from '../controller/auth.controller.js';

const userRouter = express.Router();

userRouter.post('/register', validateRegistration, registerUser);

userRouter.post('/login', validateLogin, loginUser);

export default userRouter;
