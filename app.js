import express from 'express';
import postRouter from './router/posts.js';
import commentRouter from "./router/comments.js";
import userRouter  from "./router/users.js";
import bodyParser from 'body-parser';

const app = express();


app.use(bodyParser.json());



app.get('/', (req, res) => {
    res.send('Hello Sucker!');
})
app.use( '/posts', postRouter);

app.use( '/comments',commentRouter);

app.use( '/users',userRouter);

export default app;