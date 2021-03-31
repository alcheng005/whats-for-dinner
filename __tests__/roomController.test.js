/* eslint-disable no-undef */
const dbHandler = require('../server/dbHandler.js');
const roomController = require('../server/controllers/roomController.js');
const { validRoomChars } = require('../config.js');

const validRoomRegex = new RegExp(`^[${validRoomChars}]{4}$`);

// Connect to a new in-memory database before running any tests
beforeAll(async () => await dbHandler.connect()); // eslint-disable-line no-return-await

// Clear all test data after every test
afterEach(async () => await dbHandler.clearDatabase()); // eslint-disable-line no-return-await

// Remove and close the db and server
afterAll(async () => await dbHandler.closeDatabase()); // eslint-disable-line no-return-await

describe('roomController unit tests', () => {
  it('roomController.createRoom should store a valid room code on res.locals.roomCode', async (done) => {
    const mockReq = {};
    const mockRes = {
      locals: {},
    };
    const mockNext = jest.fn();

    await roomController.createRoom(mockReq, mockRes, mockNext);
    expect(validRoomRegex.test(mockRes.locals.roomCode)).toBe(true);
    done();
  });
});
