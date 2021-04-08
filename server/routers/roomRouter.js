/* eslint-disable function-paren-newline */
const path = require('path');
const express = require('express');
const webpack = require('webpack'); // eslint-disable-line import/no-extraneous-dependencies
const webpackDevMw = require('webpack-dev-middleware'); // eslint-disable-line import/no-extraneous-dependencies

const roomController = require('../controllers/roomController.js');
const webpackDevConfig = require('../../webpack.dev.js');

const router = express.Router();

router.get('/create-room',
  roomController.createRoom,
  roomController.verifyRoom,
  (req, res) => {
    res.status(200).json({ roomCode: res.locals.roomCode });
  },
);

router.post('/join-room',
  roomController.verifyRoom,
  (req, res) => {
    res.status(200).json({ roomCode: res.locals.roomCode });
  },
);

// need two router.get('/:roomCode', ...) since don't want to compile webpack in prod env
if (process.env.NODE_ENV === 'production') {
  router.get('/:roomCode',
    roomController.verifyRoom,
    (req, res) => {
      console.log('prod /:roomCode route req.params:', req.params);
      console.log('prod /:roomCode route res.locals.roomCode:', res.locals.roomCode);
      if (res.locals.roomCode === null) return res.status(302).redirect('/');

      return res.status(200).sendFile(path.join(__dirname, '../../build/index.html'));
    },
  );
} else {
  router.get('/:roomCode',
    roomController.verifyRoom,
    (req, res, next) => {
      console.log('dev /:roomCode route req.params:', req.params);
      console.log('dev /:roomCode route res.locals.roomCode:', res.locals.roomCode);
      if (res.locals.roomCode === null) return res.status(302).redirect('/');

      return next();
    },
    webpackDevMw(webpack(webpackDevConfig)),
  );
}

module.exports = router;
