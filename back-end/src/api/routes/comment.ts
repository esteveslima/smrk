import express from 'express';
import * as comment from '../controllers/comment';

export const joinToRouter = (mainRouter: express.Router) : void => {
  const commentsRouter = express.Router();
  mainRouter.use('/comments', commentsRouter);

  commentsRouter.get('/firstRoute', comment.firtRoute);
  commentsRouter.get('/', (req, res) => res.send('get'));
  commentsRouter.post('/', (req, res) => res.send('post'));
};
