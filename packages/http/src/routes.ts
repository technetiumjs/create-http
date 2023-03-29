import { HttpRoute } from '@techjs/http';

// controllers

import {
  PingController,
} from './controllers/';

// routes

export const routes: HttpRoute<PingController>[] = [
  new HttpRoute('/ping', 'get', PingController, 'ping'),
];
