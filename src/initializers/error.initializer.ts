import express, { Request, Response, NextFunction, Application } from 'express'
import { ApiError } from 'src/lib/common/errors/errors';
import { NotImplementedError } from '../lib/common/errors';
import Initializer from './initializer';

const ErrorInitializer: Initializer = new Initializer(
  (app: Application) => {
    app.use((req: Request, res: Response, next: NextFunction) => 
      next(NotImplementedError(req)));
    app.use((apiError: ApiError, req: Request, res: Response, next: NextFunction) =>
      res.status(apiError.statusCode || 520).send(apiError.error));
    return app;
  }
);

export default ErrorInitializer;

