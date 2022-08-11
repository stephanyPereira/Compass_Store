import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

import routes from './routes/index.router';
import './infra/database/mongo/index';
import AppError from './errors/AppError';

import swaggerFile from './swagger.json';

dotenv.config({
  path: '.env',
});

class App {
  public server: express.Application;

  public constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  public init(): express.Application {
    return this.server;
  }

  private middlewares(): void {
    this.server.use(express.json({}));
    this.server.use(
      express.urlencoded({
        extended: true,
      }),
    );
    this.server.use(cors());
  }

  private routes(): void {
    this.server.use(
      '/api/v1/docs',
      swaggerUi.serve,
      swaggerUi.setup(swaggerFile),
    );
    this.server.use('/api/v1', ...routes);
    this.server.use(
      (
        err: Error,
        request: Request,
        response: Response,
        next: NextFunction,
      ) => {
        if (err instanceof AppError) {
          return response.status(err.statusCode).json({
            message: err.message,
            details: [
              {
                message: err.details,
              },
            ],
          });
        }

        return response.status(500).json({
          message: `Internal server error`,
          details: [
            {
              message: err.message,
            },
          ],
        });
      },
    );
  }
}

export default App;
