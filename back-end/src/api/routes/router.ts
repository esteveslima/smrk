import express from 'express';
import * as commentRouter from './comment';
import * as userRouter from './user';

export default () : express.Router => {
  const router = express.Router();

  router.get('/public/status', (req, res/* , next */) : void => {
    res.status(200).json({ Status: true });
  });

  commentRouter.joinToRouter(router);
  userRouter.joinToRouter(router);

  router.all('*', (req, res/* , next */) : void => {
    res.status(404).json({ Status: false, message: 'Route not found' });
  });

  return router;
};
