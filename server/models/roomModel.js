const mongoose = require('mongoose');

const { Schema } = mongoose;

const roomSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 1800, // 30 mins
  },
  menuOptions: Schema.Types.Mixed,
});

module.exports = mongoose.model('room', roomSchema);
