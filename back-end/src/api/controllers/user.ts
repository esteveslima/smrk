import type { RequestHandler } from 'express'; // eslint-disable-line no-unused-vars
import * as wrapAsync from '../../services/async/wrap-async';
import ErrorResponse from '../../services/error/structure/error-response';

import User from '../../database/models/User';

export const createUser : RequestHandler = async (req, res) : Promise<void> => {
  const { name, password, email } = req.body;

  const user = await User.create({ name, password, email });
  if (!user) throw new ErrorResponse(ErrorResponse.errorCodes.NOT_FOUND, user);

  res.status(200).json({ user });
};

export const getUser : RequestHandler = async (req, res) : Promise<void> => {
  const { userId } = req.params;

  const user = await User.findByPk(userId, {
    include: { association: 'comments' },
  });
  if (!user) throw new ErrorResponse(ErrorResponse.errorCodes.NOT_FOUND, user);

  res.status(200).json({ user });
};

wrapAsync.wrapAsyncFunctions(this);
