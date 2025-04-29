const mongoose = require('mongoose');
const { deleteRating } = require('../testcontrollers/deletehotelrating.controllers');

jest.mock('../models/Hotel');
const Hotel = require('../models/Hotel');

describe('Hotel Controller - deleteRating', () => {
  let req;
  let res;
  let mockHotel;
  const hotelId = new mongoose.Types.ObjectId().toString();
  const ratingId = new mongoose.Types.ObjectId().toString();

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      params: { id: hotelId, ratingId },
      user: { id: 'user123', role: 'user' }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    mockHotel = {
      _id: hotelId,
      hotelName: 'Test Hotel',
      rating: [{ _id: ratingId, score: 4, comment: 'Good hotel', user: 'user123' }],
      updateOne: jest.fn().mockResolvedValue(true)
    };
  });

  test('should allow admin to delete any rating', async () => {
    req.user = { id: 'admin123', role: 'admin' };
    Hotel.findById.mockResolvedValue(mockHotel);

    await deleteRating(req, res);

    expect(mockHotel.updateOne).toHaveBeenCalledWith({
      $pull: { rating: { _id: ratingId } },
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });

  test('should allow user to delete their own rating', async () => {
    req.user = { id: 'user123', role: 'user' };
    Hotel.findById.mockResolvedValue(mockHotel);

    await deleteRating(req, res);

    expect(mockHotel.updateOne).toHaveBeenCalledWith({
      $pull: { rating: { _id: ratingId } },
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });

  test('should return 400 if user tries to delete someone else’s rating', async () => {
    req.user = { id: 'user123', role: 'user' };
    mockHotel.rating[0].user = 'otherUserId';
    Hotel.findById.mockResolvedValue(mockHotel);

    await deleteRating(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'You are not owner of this rating'
    });
  });   
  test('should handle errors and return 400', async () => {
    const error = new Error('Database error');
    Hotel.findById.mockRejectedValue(error);
  
    await deleteRating(req, res);
  
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false });
  });
});
