import express, { Application } from 'express'
import Initializer from './initializer';

const StaticInitializer: Initializer = new Initializer(
  (app: Application) => app
);

export default StaticInitializer;