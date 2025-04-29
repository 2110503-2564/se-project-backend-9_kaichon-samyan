const { ratingHotel } = require('../testcontrollers/ratinghotel.controllers');
const Hotel = require('../models/Hotel');
const mongoose = require('mongoose');

jest.mock('../models/Hotel');

describe('Hotel Controller - ratingHotel', () => {
  let req;
  let res;
  let mockHotel;
  const hotelId = new mongoose.Types.ObjectId().toString();

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      params: { id: hotelId },
      body: { score: 4, comment: 'Great hotel with friendly staff' },
      user: { id: 'user123' }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    mockHotel = {
      _id: hotelId,
      hotelName: 'Test Hotel',
      rating: [],
      save: jest.fn().mockResolvedValue(true)
    };

    Hotel.findById.mockResolvedValue(mockHotel);
  });

  test('should add a rating to a hotel successfully', async () => {
    await ratingHotel(req, res);

    expect(Hotel.findById).toHaveBeenCalledWith(hotelId);
    expect(mockHotel.rating).toHaveLength(1);
    expect(mockHotel.rating[0]).toEqual({
      score: 4,
      comment: 'Great hotel with friendly staff',
      user: 'user123'
    });
    expect(mockHotel.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });

  test('should return 400 if score is not provided', async () => {
    req.body = { comment: 'Great hotel with friendly staff' };

    await ratingHotel(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Score is required. Please provide a valid score to proceed.'
    });
    expect(Hotel.findById).not.toHaveBeenCalled();
  });

  test('should return 400 if score is negative', async () => {
    req.body.score = -1;

    await ratingHotel(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'score cannot be negative (lowerbound)'
    });
    expect(Hotel.findById).not.toHaveBeenCalled();
  });

  test('should return 400 if score is greater than 5', async () => {
    req.body.score = 6;

    await ratingHotel(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'score cannot be more than 5 (upperbound)'
    });
    expect(Hotel.findById).not.toHaveBeenCalled();
  });

  test('should handle rating without comment', async () => {
    req.body = { score: 4 };

    await ratingHotel(req, res);

    expect(Hotel.findById).toHaveBeenCalledWith(hotelId);
    expect(mockHotel.rating).toHaveLength(1);
    expect(mockHotel.rating[0]).toEqual({
      score: 4,
      comment: undefined,
      user: 'user123'
    });
    expect(mockHotel.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });
  test('should return 400 if Hotel.findById throws an error', async () => {
    Hotel.findById.mockRejectedValue(new Error('DB error'));
  
    await ratingHotel(req, res);
  
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false });
  });
});

