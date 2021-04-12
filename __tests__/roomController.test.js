/**
 * @jest-environment node
 */

/* eslint-disable no-undef */
const dbHandler = require('../server/dbHandler.js');
const Room = require('../server/models/roomModel.js');
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
  it('checkPhase should store the current phase of a room on res.locals.curPhase', async (done) => {
    const mockReq1 = { body: { code: 'JJJJ' } };
    const mockRes1 = { locals: {} };
    const mockReq2 = { body: { code: 'KKKK' } };
    const mockRes2 = { locals: {} };
    const mockReq3 = { body: { code: 'LLLL' } };
    const mockRes3 = { locals: {} };
    const mockNext = jest.fn();

    await Promise.all([
      Room.create({ code: mockReq1.body.code }),
      Room.create({ code: mockReq2.body.code, phase: 'vote' }),
      Room.create({ code: mockReq3.body.code, phase: 'results' }),
    ]);
    await Promise.all([
      roomController.checkPhase(mockReq1, mockRes1, mockNext),
      roomController.checkPhase(mockReq2, mockRes2, mockNext),
      roomController.checkPhase(mockReq3, mockRes3, mockNext),
    ]);

    expect(mockRes1.locals.curPhase).toBe('menu');
    expect(mockRes2.locals.curPhase).toBe('vote');
    expect(mockRes3.locals.curPhase).toBe('results');
    done();
  });

  it('checkPhase should not store \'menu\', \'vote\', nor \'results\', on res.locals.curPhase for invalid and nonexistent rooms', async (done) => {
    const mockReq1 = { body: { code: 'A' } };
    const mockRes1 = { locals: {} };
    const mockReq2 = { body: { code: 'LLLL' } };
    const mockRes2 = { locals: {} };
    const mockNext = jest.fn();

    await Promise.all([
      roomController.checkPhase(mockReq1, mockRes1, mockNext),
      roomController.checkPhase(mockReq2, mockRes2, mockNext),
    ]);

    expect(mockRes1.locals.curPhase).not.toBe('menu');
    expect(mockRes1.locals.curPhase).not.toBe('vote');
    expect(mockRes1.locals.curPhase).not.toBe('results');
    expect(mockRes2.locals.curPhase).not.toBe('menu');
    expect(mockRes2.locals.curPhase).not.toBe('vote');
    expect(mockRes2.locals.curPhase).not.toBe('results');
    done();
  });

  it('createRoom should store a valid room code on res.locals.roomCode', async (done) => {
    const mockReq = {};
    const mockRes = { locals: {} };
    const mockNext = jest.fn();

    await roomController.createRoom(mockReq, mockRes, mockNext);

    expect(validRoomRegex.test(mockRes.locals.roomCode)).toBe(true);
    done();
  });

  it('verifyRoom should store \'null\' on res.locals.roomCode if room does not exist in database', async (done) => {
    const mockReq = {};
    const mockRes = { locals: { roomCode: 'BBBB' } };
    const mockNext = jest.fn();

    await roomController.verifyRoom(mockReq, mockRes, mockNext);

    expect(mockRes.locals.roomCode).toBe(null);
    done();
  });

  it('verifyRoom should store a room code on res.locals.roomCode if res.locals.roomCode exists and the room exists in database', async (done) => {
    const mockReq = {};
    const mockRes = { locals: { roomCode: 'BBBB' } };
    const mockNext = jest.fn();

    await Room.create({ code: mockRes.locals.roomCode });
    await roomController.verifyRoom(mockReq, mockRes, mockNext);

    expect(mockRes.locals.roomCode).toBe(mockRes.locals.roomCode);
    done();
  });

  it('verifyRoom should store a room code on res.locals.roomCode if req.body.code exists and the room exists in database', async (done) => {
    const mockReq = { body: { code: 'CCCC' } };
    const mockRes = { locals: {} };
    const mockNext = jest.fn();

    await Room.create({ code: mockReq.body.code });
    await roomController.verifyRoom(mockReq, mockRes, mockNext);

    expect(mockRes.locals.roomCode).toBe(mockReq.body.code);
    done();
  });

  it('verifyRoom should store a room code on res.locals.roomCode if req.params.roomCode exists and the room exists in database', async (done) => {
    const mockReq = {
      body: {},
      params: { roomCode: 'DDDD' },
    };
    const mockRes = { locals: {} };
    const mockNext = jest.fn();

    await Room.create({ code: mockReq.params.roomCode });
    await roomController.verifyRoom(mockReq, mockRes, mockNext);

    expect(mockRes.locals.roomCode).toBe(mockReq.params.roomCode);
    done();
  });
});
