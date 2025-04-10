const Hotel = require('../models/Hotel');

exports.getHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find();

    res.status(200).json({ data: hotels });
  } catch (error) {
    res.status(400).json({ success: false });
  }
}

exports.getHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    
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
    res.status(400).json({ success: false });
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