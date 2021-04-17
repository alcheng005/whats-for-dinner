const mongoose = require('mongoose');

const { Schema } = mongoose;

const roomSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 1800, // 30 mins
  },
  phase: {
    type: String,
    enum: ['menu', 'vote', 'results'],
    default: 'menu',
  },
  menuOptions: Schema.Types.Mixed,
});

module.exports = mongoose.model('room', roomSchema);
