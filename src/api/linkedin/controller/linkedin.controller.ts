import { Inject, Injectable } from "@decorators/di";
import { Response,} from 'express';
import { Response as Res, Params, Controller, Get } from '@decorators/express';

import ApiController from '../../../lib/controller';
import { Logger, StdLogger } from "../../../lib/loggers";
import LinkedInService from "../service/linkedin.service";

@Controller('/linkedin')
@Injectable()
export default class LinkedInController extends ApiController {
  
  constructor(
    @Inject(StdLogger) private logger: Logger,
    @Inject(LinkedInService) private service: LinkedInService
  ){
    super(logger, 'LinkedInController');
  }

  @Get('/:username')
  getUserProfile(@Res() res: Response, @Params('username') username: string) {
    return this.service.getProfile(username)
      .then(p => res.json(p))
      .catch(err => res.status(500).json({ message: err.message }))
  }
}
