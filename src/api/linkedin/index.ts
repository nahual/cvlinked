import express, { Router } from 'express';
import { attachControllers } from '@decorators/express';

import LinkedInController from './controller/linkedin.controller';

const router: Router = express.Router();
attachControllers(router, [LinkedInController]);

const LinkedInRouter: Router = router;
export default LinkedInRouter;
