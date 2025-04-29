const Hotel = require('../models/Hotel');

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