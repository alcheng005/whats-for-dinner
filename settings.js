require('regenerator-runtime/runtime'); // for async/await in testing

// no vowels in order to prevent inappropriate words
const validRoomChars = 'BCDFGHJKLMNPQRSTVWXZ';
const roomCodeLength = 4;

module.exports = {
  validRoomChars,
  roomCodeLength,
};
