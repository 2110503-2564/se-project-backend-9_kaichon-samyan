const { default: mongoose } = require('mongoose');
const monggose = require('mongoose');

const SessionSchema = new monggose.Schema({
  hotel: {
    type: monggose.Schema.Types.ObjectId,
    ref: "Hotel",
    required: true
  },
  user: {
    type: monggose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  checkIn: {
    type: Date,
    required: true
  },
  checkOut: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Session', SessionSchema);