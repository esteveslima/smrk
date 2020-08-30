import type { RequestHandler } from 'express'; // eslint-disable-line no-unused-vars
import * as wrapAsync from '../../services/async/wrap-async';
import ErrorResponse from '../../services/error/structure/error-response';

export const firtRoute : RequestHandler = async (req, res) : Promise<void> => {
  res.status(200).json({ message: 'ok' });
};

wrapAsync.wrapAsyncFunctions(this);
