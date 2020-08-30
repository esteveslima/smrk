import express from 'express';
import * as comment from '../controllers/comment';
import * as validate from '../middlewares/validate-request';

export const joinToRouter = (mainRouter: express.Router) : void => {
  const commentRouter = express.Router();
  mainRouter.use('/comment', commentRouter);

  commentRouter.post('/create', validate.checkUser, comment.createComment);
  commentRouter.get('/get/:commentId', comment.getComment);
  commentRouter.delete('/delete/:commentId', validate.checkComment, comment.deleteComment);
};
