import express, { Request, Response, NextFunction } from 'express';
import { ApplicationError } from './errors';
import connectDb from './db';
import { router } from "./routes";

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use(router);

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.log('Proso brzi voz');
  console.error(error.message);
  if (error instanceof ApplicationError) {
    res.status(error.statusCode).send({ message: error.message, datails: error.details });
  }
  res.status(502).send({ message: error.message })
});

let server;

connectDb().then(() => {
  server = app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });

  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received. Closing server...');
    server.close(() => {
      console.log('Server closed.');
      process.exit(0);
    });
  });

  process.on('uncaughtException', (err: Error) => {
    console.error('Uncaught exception:', err);
    server.close(() => {
      console.log('Server closed.');
      process.exit(1);
    });
  });
}).catch((err) => {
  console.error('Error connecting to database:', err);
  process.exit(1);
});

export default { app, server };
