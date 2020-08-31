import type { RequestHandler } from 'express'; // eslint-disable-line no-unused-vars
import * as wrapAsync from '../../services/async/wrap-async';
import ErrorResponse from '../../services/error/structure/error-response';

import * as Comment from '../../database/dao/commentDao';

export const createComment : RequestHandler = async (req, res) : Promise<void> => {
  const { text, userId } = req.body;

  const comment = await Comment.create({ text, userId });
  if (!comment) throw new ErrorResponse(ErrorResponse.errorCodes.NOT_FOUND, comment);

  res.status(200).json({ comment });
};

export const getComment : RequestHandler = async (req, res) : Promise<void> => {
  const { commentId } = req.params;

  const comment = await Comment.find(commentId, {
    include: { association: 'user' },
  });
  if (!comment) throw new ErrorResponse(ErrorResponse.errorCodes.NOT_FOUND, comment);

  res.status(200).json({ comment });
};

export const deleteComment : RequestHandler = async (req, res) : Promise<void> => {
  const { commentId } = req.params;

  const comment = await Comment.remove({
    where: { id: commentId },
    force: true,
  });
  if (!comment) throw new ErrorResponse(ErrorResponse.errorCodes.NOT_FOUND, comment);

  res.status(200).json({ Status: 'true' });
};

wrapAsync.wrapAsyncFunctions(this);
