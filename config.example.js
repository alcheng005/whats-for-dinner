require('regenerator-runtime/runtime'); // for async/await in testing

// no vowels in order to prevent inappropriate words
const validRoomChars = 'BCDFGHJKLMNPQRSTVWXZ';
const roomCodeLength = 4;

// change value of mongoURI to your mongoDB URI
const mongoURI = 'your-mongoDB-URI-here';

module.exports = {
  validRoomChars,
  roomCodeLength,
  mongoURI,
};
