const Room = require('../models/roomModel.js');
const { validRoomChars } = require('../../config.js');

const roomController = {};

roomController.createRoom = async (req, res, next) => {
  const validCharsLength = validRoomChars.length;
  let roomCode = '';
  let invalidCode = true;

  while (invalidCode) {
    for (let i = 0; i < 4; i += 1) {
      roomCode += validRoomChars.charAt(Math.floor(Math.random() * validCharsLength));
    }

    try {
      // eslint-disable-next-line no-await-in-loop
      const roomInfo = await Room.findOneAndUpdate(
        { code: roomCode },
        { $set: { code: roomCode } },
        { new: true, upsert: true, rawResult: true },
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
        log: 'ERROR in roomController.createRoom: Something went wrong when checking if Room exists',
        status: 502,
        message: { err: 'Unable to create room' },
      });
    }
  }

  res.locals.roomCode = roomCode;
  return next();
};

roomController.verifyRoom = (req, res, next) => {

};

module.exports = roomController;
