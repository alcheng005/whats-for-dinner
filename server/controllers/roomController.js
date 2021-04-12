const Room = require('../models/roomModel.js');
const { validRoomChars, roomCodeLength } = require('../../config.js');

const roomController = {};

roomController.checkPhase = async (req, res, next) => {
  const roomCode = req.body.code.toUpperCase();

  try {
    const roomInfo = await Room.findOne({ code: roomCode });
    const { phase } = roomInfo;

    res.locals.curPhase = phase;
    return next();
  } catch (err) {
    return next({
      log: `ERROR in roomController.checkPhase: ${err}`,
      status: 502,
      message: { err: 'Something went wrong - Unable to check phase of room' },
    });
  }
};

roomController.createRoom = async (req, res, next) => {
  const validCharsLength = validRoomChars.length;
  let roomCode = '';
  let invalidCode = true;

  while (invalidCode) {
    for (let i = 0; i < roomCodeLength; i += 1) {
      roomCode += validRoomChars.charAt(Math.floor(Math.random() * validCharsLength));
    }

    try {
      // eslint-disable-next-line no-await-in-loop
      const roomInfo = await Room.findOneAndUpdate(
        { code: roomCode },
        { $set: { code: roomCode } },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
          rawResult: true,
        },
      );

      // if a document was updated, that means the room already existed - so need to create a new
      // room code (below if check won't pass). Using !== 'true' instead of === 'false' so in case
      // something is wrong and undefined is evaluated, user isn't stuck waiting for server response
      if (roomInfo.lastErrorObject.updatedExisting !== 'true') {
        // if a new room was created, can break out of loop
        invalidCode = false;
      }
    } catch (err) {
      return next({
        log: `ERROR in roomController.createRoom: ${err}`,
        status: 502,
        message: { err: 'Something went wrong - Unable to create a room' },
      });
    }
  }

  console.log('roomCode:', roomCode);

  res.locals.roomCode = roomCode;
  return next();
};

roomController.verifyRoom = async (req, res, next) => {
  let roomCode;
  // console.log('res.locals.roomCode:', res.locals.roomCode);
  // console.log('req.body.code:', req.body.code);
  // console.log('req.params.roomCode:', req.params.roomCode);

  // if room code was generated through roomController.createRoom
  if (res.locals.roomCode) roomCode = res.locals.roomCode;
  // if room code was sent via 'Join Room' on website homepage
  else if (req.body.code) {
    roomCode = req.body.code.toUpperCase();
    res.locals.roomCode = roomCode;
  // if room code is entered directly via URL
  } else {
    roomCode = req.params.roomCode.toUpperCase();
    res.locals.roomCode = roomCode;
  }

  try {
    const exists = await Room.exists({ code: roomCode });

    console.log('exists:', exists);

    if (!exists) {
      res.locals.roomCode = null;
    }

    return next();
  } catch (err) {
    return next({
      log: `ERROR in roomController.verifyRoom: ${err}`,
      status: 502,
      message: { err: 'Something went wrong - Unable to join a room' },
    });
  }
};

module.exports = roomController;
