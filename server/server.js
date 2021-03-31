/* eslint-disable no-console */
const path = require('path');
const express = require('express');
const webpack = require('webpack'); // eslint-disable-line import/no-extraneous-dependencies
const webpackDevMw = require('webpack-dev-middleware'); // eslint-disable-line import/no-extraneous-dependencies

const app = express();

const http = require('http').createServer(app);
const io = require('socket.io')(http);

const dbHandler = require('./dbHandler.js');
const roomRouter = require('./routers/roomRouter.js');
const webpackDevConfig = require('../webpack.dev.js');

const PORT = '3000';

// start mongoDB connection
dbHandler.connect();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/room', roomRouter);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));

  app.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '../build/index.html'));
  });

  // catch-all route handler for requests to unknown routes
  app.use('*', (req, res) => {
    res.status(301).sendFile(path.join(__dirname, '../build/index.html'));
  });
} else {
  // catch-all route handler
  app.use('*', webpackDevMw(webpack(webpackDevConfig)));
}

// global error handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  const errorObj = {
    log: 'Express caught an unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
    ...err,
  };

  console.log('Global Error Handler:', errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

http.listen(PORT, () => {
  console.log('Server is up on port:', PORT);
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('joinRoom', (data) => {
    console.log(data);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});
