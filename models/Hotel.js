const mongoose = require('mongoose');

const HotelSchema = new mongoose.Schema({
  hotelName: {
    type: String,
    require: [true, 'Please add hotel name']
  },
  address: {
    type: String,
    required: [true, 'Please add an address']
  },
  website: {
      type: String,
      required: [true, 'Please add a website'],
      unique: true
  },
  description: {
      type: String,
      requried: [true, 'Please add a description']
  },
  tel: {
    type: String,
    required: [true, 'Please add a tel']
  },
  rating: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId()
      },
      score: {
        type: Number,
        required: true
      },
      comment: {
        type: String,
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      }
    }
  ]
})

module.exports = mongoose.model('Hotel', HotelSchema);