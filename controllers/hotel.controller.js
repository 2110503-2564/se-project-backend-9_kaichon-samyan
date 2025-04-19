const Hotel = require('../models/Hotel');
const mongoose = require('mongoose');

exports.getHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find().populate({ path: "rating.user" });

    res.status(200).json({ data: hotels });
  } catch (error) {
    res.status(400).json({ success: false });
  }
}

exports.getHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id).populate({ path: "rating.user"});
    
    res.status(200).json({ data: hotel });
  } catch (error) {
    res.status(400).json({ success: false });
  }
}

exports.createHotel = async (req, res) => {
  try {
    const { hotelName, address, website, description, tel } = req.body;

    if(!hotelName || !address || !website || !description || !tel) {
      res.status(400).json({ success: false, message: "Please enter all information "});
      return;
    }

    const hotel = await Hotel.create(req.body);

    res.status(200).json({ success: true, data: hotel });

  } catch (error) {
    res.status(400).json({ success: false, error });
  }
}

exports.deleteHotel = async (req, res) => {
  try {
    await Hotel.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true });

  } catch (error) {
    res.status(400).json({ success: false });
  }
}

exports.ratingHotel = async (req, res) => {
  try {
    const { id: hotelId } = req.params;
    const { score, comment } = req.body;

    if(!score) {
      return res.status(400).json({ success: false, message: "Score is required. Please provide a valid score to proceed." });
    }

    const hotel = await Hotel.findById(hotelId);

    hotel.rating.push({
      score: score, 
      comment: comment,
      user: req.user.id
    });

    hotel.save();

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false });
  }
}

exports.changeRating = async (req, res) => {
  try {
    const user = req.user;
    const { id: hotelId, ratingId } = req.params;
    const { newComment, newScore } = req.body;

    const hotel = await Hotel.findById(hotelId);
    const rating = hotel.rating.find(rating => rating._id.toString() === ratingId);

    if(user.role === "admin") {
      await Hotel.updateOne(
        { _id: hotelId, "rating._id": ratingId },
        {
          $set: {
            "rating.$[elem].comment": newComment,
            "rating.$[elem].score": newScore
          }
        },
        {
          arrayFilters: [{ "elem._id": new mongoose.Types.ObjectId(ratingId) }]
        }
      );
    }
    else if(user.role === "user") {
      if(rating.user.toString() !== user.id.toString()) {
        return res.status(400).json({ success: false, message: "You are not owner of this rating" });
      }

      await Hotel.updateOne(
        { _id: hotelId, "rating._id": ratingId },
        {
          $set: {
            "rating.$[elem].comment": newComment,
            "rating.$[elem].score": newScore
          }
        },
        {
          arrayFilters: [{ "elem._id": new mongoose.Types.ObjectId(ratingId) }]
        }
      );
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false });
  }
}

exports.deleteRating = async (req, res) => {
  try {
    const user = req.user;
    const { id: hotelId, ratingId } = req.params;

    const hotel = await Hotel.findById(hotelId);

    const rating = hotel.rating.find(rating => rating._id.toString() === ratingId);

    if(user.role === "admin") {
      await hotel.updateOne({
        $pull: {
          rating: {
            _id: ratingId
          }
        }
      })

      res.status(200).json({ success: true });
    }
    else if(user.role === "user") {
      if(rating.user.toString() !== user.id.toString()) {
        return res.status(400).json({ success: false, message: "You are not owner of this rating" });
      }

      await hotel.updateOne({
        $pull: {
          rating: {
            _id: ratingId
          }
        }
      });

      res.status(200).json({ success: true });
    }
    
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false });
  }
}