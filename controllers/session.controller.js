const Session = require('../models/Session')
const Hotel = require('../models/Hotel');

exports.getSessions = async (req, res) => {
  try {
    const user = req.user;
    let sessions = null;

    if(user.role === "admin") {
      sessions = await Session.find().populate({ path: "user" }).populate({ path: 'hotel' });
    }
    else if (user.role === "user") {
      sessions = await Session.find({ user: user.id }).populate({ path: "user" }).populate({ path: "hotel" });
    }

    res.status(200).json({ success: true, data: sessions});
  } catch (error) {
    res.status(400).json({ success: false });
  }
}

exports.createSession = async (req, res) => {
  try {
    const user = req.user;
    const { hotelId, checkIn, checkOut } = req.body;

    const hotel = await Hotel.findById(hotelId);
    if(!hotel) {
      return res.status(400).json({ success: false, message: "Hotel not found" });
    }

    const sessionCount = await Session.find({user: user.id}).countDocuments();
    if(sessionCount >=3 ) {
      return res.status(400).json({ success: false, message: "You're already booking up to 3 sessions limit."})
    }

    const session = await Session.create({
      hotel: hotelId,
      user: user.id,
      checkIn: checkIn,
      checkOut: checkOut
    });

    res.status(200).json({ success: true, data: session });
  } catch (error) {
    res.status(400).json({ success: false });
  }
}

exports.updateSession = async (req, res) => {
  try {
    const user = req.user;
    const { id: sessionId } = req.params;
    const { checkIn, checkOut } = req.body;

    if(user.role === "admin") {
      const session = await Session.findByIdAndUpdate(sessionId, 
        { 
          checkIn: checkIn,
          checkOut: checkOut
        },
        { new: true }
      );

      res.status(200).json({ success: true, data: session });
    }
    else if (user.role === "user") {
      let session = await Session.findById(sessionId);

      if(session.user.toString() !== user.id) {
        return res.status(401).json({ success: false, message: "You're not owner of this session" });
      }
      
      session = await Session.findByIdAndUpdate(sessionId, 
        { 
          checkIn: checkIn,
          checkOut: checkOut
         },
        { new: true }
      );

      res.status(200).json({ success: true, data: session });
    }
  } catch (error) {
    console.log(error);  
    res.status(400).json({ success: false });
  }
}

exports.deleteSession = async (req, res) => {
  try {
    const user = req.user;
    const { id: sessionId } = req.params;

    if(user.role === "admin") {
      await Session.findOneAndDelete(sessionId);

      res.status(200).json({ success: true });
    }
    else if (user.role === "user") {
      const session = await Session.findById(sessionId);

      if(session.user.toString() !== user.id) {
        // console.log(session.user.toString(), user.id)
        return res.status(401).json({ success: false, message: "You're not owner of this session" });
      }

      await Session.findByIdAndDelete(sessionId);
      return res.status(200).json({ success: true });
    }
  } catch (error) {
    res.status(400).json({ success: false });
  }
}