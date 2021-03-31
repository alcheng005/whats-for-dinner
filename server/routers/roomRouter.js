/* eslint-disable function-paren-newline */
const path = require('path');
const express = require('express');
const webpack = require('webpack'); // eslint-disable-line import/no-extraneous-dependencies
const webpackDevMw = require('webpack-dev-middleware'); // eslint-disable-line import/no-extraneous-dependencies

const roomController = require('../controllers/roomController.js');
const webpackDevConfig = require('../../webpack.dev.js');

const router = express.Router();

router.post('/create-room',
  roomController.createRoom,
  (req, res) => {
    res.status(302).redirect(`/room/${res.locals.roomCode}`);
  },
);

if (process.env.NODE_ENV === 'production') {
  router.get('/:roomId',
    roomController.verifyRoom,
    (req, res) => {
      res.status(200).sendFile(path.join(__dirname, '../../build/index.html'));
    },
  );
} else {
  router.get('/:roomId',
    roomController.verifyRoom,
    webpackDevMw(webpack(webpackDevConfig)),
  );
}

module.exports = router;
