require("regenerator-runtime/runtime"); // for async/await in testing

// change variable value below
const mongoURI = 'your-mongoDB-URI-here';

// no vowels in order to prevent inappropriate words
const validRoomChars = 'BCDFGHJKLMNPQRSTVWXZ';

module.exports = {
  mongoURI,
  validRoomChars,
};
