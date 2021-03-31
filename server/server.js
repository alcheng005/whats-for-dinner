/* eslint-disable no-console */
const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackDevMw = require('webpack-dev-middleware');

const app = express();

const http = require('http').createServer(app);
const io = require('socket.io')(http);
const dbHandler = require('./dbHandler.js');
const webpackDevConfig = require('../webpack.dev.js');

const PORT = '3000';

// start mongoDB connection
dbHandler.connect();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));

  // move into a router file
  app.get('/room/:roomId', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '../build/index.html'));
  });

  app.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '../build/index.html'));
  });

  // catch-all route handler for requests to unknown routes
  app.use('*', (req, res) => {
    res.status(302).sendFile(path.join(__dirname, '../build/index.html'));
  });
} else {
  // move into a router file
  app.get('/room/:roomId', webpackDevMw(webpack(webpackDevConfig)));

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

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});
