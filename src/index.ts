import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const server = app.listen(3000, () => {
  console.log('Server listening on port 3000');
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

export default app;