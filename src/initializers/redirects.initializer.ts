import { Application } from 'express'
import Initializer from './initializer';

const RedirectsInitializer: Initializer = new Initializer(
  (app: Application) => app
);

export default RedirectsInitializer;