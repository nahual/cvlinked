import { Inject, Injectable } from "@decorators/di";
import { Response,} from 'express';
import { Response as Res, Controller, Get, Post, Request as Req, Body, Query } from '@decorators/express';

import ApiController from '../../../lib/controller';
import { Levels, Logger, StdLogger } from "../../../lib/loggers";
import LinkedInService from "../service/linkedin.service";
import SingleFileUploadMiddleware from '../../../lib/common/middlewares/single_file_upload';

import csvtojson from 'csvtojson';
import { v1 as uuidv1 } from 'uuid';
import { profile } from "winston";
@Controller('/linkedin')
@Injectable()
export default class LinkedInController extends ApiController {
  
  private uploadedCsv = {};

  constructor(
    @Inject(StdLogger) private logger: Logger,
    @Inject(LinkedInService) private service: LinkedInService
  ){
    super(logger, 'LinkedInController');
  }

  @Post('/cookie')
  async updateCookie(@Body() reqBody: Body | any, @Res() res: Response) {
    try {
      const { cookie } = reqBody
      this.service.updateSessionCookie(cookie)
      return res.sendStatus(200);
    } catch (error) {
      this.logger.log(Levels.ERROR, `Error updating cookie: ${error.message} `);
      console.log(error)
      res.status(500).json({ error });
    }
  }

  @Post('/upload', [SingleFileUploadMiddleware])
  async uploadCsvProfiles(@Req() req: Request | any, @Res() res: Response) {
    try {
      const id = uuidv1();
      const profiles = await csvtojson().fromString(req.file.buffer.toString('utf8'))

      const csv = await this.service.processProfiles(id, profiles)
      this.uploadedCsv[csv.fileName] = csv.content
      res.status(200).send({ id });
    } catch (error) {
      this.logger.log(Levels.ERROR, `Error while uploading file: ${error.message} `);
      res.status(500).json({ error });
    }
  }

  @Get('/download', [SingleFileUploadMiddleware])
  async downloadCsvProfiles(@Query('filename') filename, @Res() res: Response) {
    const csv = this.uploadedCsv[filename]
    if(!csv) return res.sendStatus(404);
    
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    res.status(200).send(csv);
  }
}
