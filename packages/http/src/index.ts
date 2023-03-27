import { HttpRouter } from '@techjs/http';
import * as cors from 'cors';
import * as express from 'express';
import { config } from './config';
import { routes } from './routes';

// create an express app
const app = express();

// add your express middleware here
app.use(cors());

// initialize a Bison HttpRouter instance
// with your routes and pass the express
// instance
const router = new HttpRouter(routes);
router.init(app);

// bind the express instance to a port
app.listen(
  config.port,
  () => console.log(`Server started and listening on port ${config.port}`),
);
