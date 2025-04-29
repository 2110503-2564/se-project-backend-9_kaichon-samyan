const Hotel = require('../models/Hotel');
const mongoose = require('mongoose');

exports.ratingHotel = async (req, res) => {
  try {
    const { id: hotelId } = req.params;
    const { score, comment } = req.body;

    if(!score) {
      return res.status(400).json({ success: false, message: "Score is required. Please provide a valid score to proceed." });
    }
    
    if(score<0){
      return res.status(400).json({success : false , message : "score cannot be negative (lowerbound)"});
    }
    if(score>5){
      return res.status(400).json({success : false , message : "score cannot be more than 5 (upperbound)"});
    }

    const hotel = await Hotel.findById(hotelId);

    hotel.rating.push({
      score: score, 
      comment: comment,
      user: req.user.id
    });

    hotel.save();

    res.status(200).json({ success: true });
  } 
  catch (error) {
    res.status(400).json({ success: false });
  }
}




