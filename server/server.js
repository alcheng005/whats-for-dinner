/* eslint-disable no-console */
const path = require('path');
const express = require('express');

const app = express();

const http = require('http').createServer(app);
const io = require('socket.io')(http);
const dbHandler = require('./dbHandler.js');

const PORT = '3000';

// start mongoDB connection
dbHandler.connect();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/build', express.static(path.join(__dirname, '../build')));

// move into a router file
app.get('/room/:roomId', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '../client/index.html'));
});

app.get('/', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '../client/index.html'));
});

// catch-all route handler for requests to unknown routes
app.use('*', (req, res) => {
  res.status(307).redirect('/');
});

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
