import { Inject, Injectable } from "@decorators/di";
import { Response,} from 'express';
import { Response as Res, Params, Controller, Get, Post, Middleware, Request as Req } from '@decorators/express';

import ApiController from '../../../lib/controller';
import { Logger, StdLogger } from "../../../lib/loggers";
import LinkedInService from "../service/linkedin.service";
import SingleFileUploadMiddleware from '../../../lib/common/middlewares/single_file_upload';

import csvtojson from 'csvtojson';
import { v1 as uuidv1 } from 'uuid';
import { profile } from "winston";
@Controller('/linkedin')
@Injectable()
export default class LinkedInController extends ApiController {
  
  constructor(
    @Inject(StdLogger) private logger: Logger,
    @Inject(LinkedInService) private service: LinkedInService
  ){
    super(logger, 'LinkedInController');
  }

  @Post('/upload', [SingleFileUploadMiddleware])
  async uploaCsvProfiles(@Req() req: Request | any, @Res() res: Response) {
    try {
      const id = uuidv1();
      const profiles = await csvtojson().fromString(req.file.buffer.toString('utf8'))

      this.service.processProfiles(id, profiles)

      res.status(200).json({ id });
    } catch (error) {
      res.status(500).json({ error });
    }
  }
}
