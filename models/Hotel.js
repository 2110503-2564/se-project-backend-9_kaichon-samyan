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
})

module.exports = mongoose.model('Hotel', HotelSchema);