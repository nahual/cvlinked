import { Inject, Injectable } from '@decorators/di';
import { Middleware } from '@decorators/express';
import  { Request, Response, NextFunction, RequestHandler } from 'express';
import { Request as Req, Response as Res, Next } from '@decorators/express';

import multer from 'multer';

@Injectable()
export default class SingleFileUploadMiddleware implements Middleware {

  private multerHandler: RequestHandler;

  constructor(){
    this.multerHandler =  multer({
      storage: multer.memoryStorage(),
      limits: { fileSize: 1024 * 2014, files: 1 }
    }).single('csv');
  }

  use(@Req() req: Request|any, @Res() res: Response, @Next() next: NextFunction): Promise<void> {
    return this.multerHandler(req, res, next);
  }
}