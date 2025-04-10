const Session = require('../models/Session')
const Hotel = require('../models/Hotel');

exports.getSessions = async (req, res) => {
  try {
    const user = req.user;
    let sessions = null;

    if(user.role === "admin") {
      sessions = await Session.find();
    }
    else if (user.role === "user") {
      sessions = await Session.find({ user: user.id });
    }

    res.status(200).json({ success: true, data: sessions});
  } catch (error) {
    res.status(400).json({ success: false });
  }
}

exports.createSession = async (req, res) => {
  try {
    const user = req.user;
    const { hotelId, date } = req.body;

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
      date: date
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
    const { date } = req.body;

    if(user.role === "admin") {
      const session = await Session.findByIdAndUpdate(sessionId, 
        { date: date },
        { new: true }
      );

      res.status(200).json({ success: true, data: session });
    }
    else if (user.role === "user") {
      const session = Session.findById(sessionId);

      if(session.user !== user.id) {
        return res.status(401).json({ success: false, message: "You're not owner of this session" });
      }
      
      session = await Session.findByIdAndUpdate(sessionId, 
        { date: date },
        { new: true }
      );

      res.status(200).json({ success: true, data: session });
    }
  } catch (error) {
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

      if(session.id !== user.id) {
        return res.status(401).json({ success: false, message: "You're not owner of this session" });
      }

      await Session.findByIdAndDelete(sessionId);
      return res.status(200).json({ success: true });
    }
  } catch (error) {
    res.status(400).json({ success: false });
  }
}