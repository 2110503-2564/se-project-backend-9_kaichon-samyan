const mongoose = require("mongoose");

const HotelSchema = new mongoose.Schema({
  hotelName: {
    type: String,
    require: [true, "Please add hotel name"],
  },
  address: {
    type: String,
    required: [true, "Please add an address"],
  },
  website: {
    type: String,
    required: [true, "Please add a website"],
    unique: true,
  },
  description: {
    type: String,
    requried: [true, "Please add a description"],
  },
  picture: {
    type: String,
    default:
      "https://img.freepik.com/free-vector/hotel-building-tropical-country-with-palms-cartoon-icon_1284-63176.jpg?t=st=1744968422~exp=1744972022~hmac=5255afad93b8d0b5e7fd4d5fd3d986ffe1101a5d8ce1bde333b563ff8abdf463&w=1800",
  },
  tel: {
    type: String,
    required: [true, "Please add a tel"],
  },
  rating: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
      },
      score: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports = mongoose.model("Hotel", HotelSchema);
