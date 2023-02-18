import express, { Request, Response, NextFunction } from 'express';
import connectDb from './db';
import { router } from "./routes";

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use(router);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
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
