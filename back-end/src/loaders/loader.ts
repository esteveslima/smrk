import * as dotenv from '../services/env/dotenv';
import expressLoader from './express/express';

export default async () => {
  dotenv.setupDotenv();

  const expressApp = expressLoader();

  return expressApp;
};
