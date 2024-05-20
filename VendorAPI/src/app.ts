import cors from 'cors';
import express, {
  ErrorRequestHandler,
  Request as ExRequest,
  Response as ExResponse,
  Express,
  Router,
} from 'express';
import swaggerUi from 'swagger-ui-express';

import { RegisterRoutes } from '../build/routes';

const app: Express = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/vendorapi/v0/docs', function(req, res) {
  res.redirect('/vendorapi/v0/docs/');
});

app.use(
  '/v0/docs/',
  swaggerUi.serve,
  async (_req: ExRequest, res: ExResponse) => {
    return res.send(
      swaggerUi.generateHTML(await import('../build/swagger.json'))
    );
  }
);

app.use('/v0/docs', (_req: ExRequest, res: ExResponse) => {
  return res.redirect('/v0/docs/');
});

const router = Router();
RegisterRoutes(router);
app.use('/v0', router);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  res.status(err.status).json({
    message: err.message,
    errors: err.errors,
    status: err.status,
  });
};
app.use(errorHandler);

export default app;
