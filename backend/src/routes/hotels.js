const express = require('express');
const router = express.Router();
const fs = require('fs');
const auth = require('../middleware/auth');

// Helper function to read hotels data
const readHotelsData = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading hotels data:', error);
    return [];
  }
};

// Helper function to write hotels data
const writeHotelsData = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing hotels data:', error);
    return false;
  }
};

// @route   GET api/hotels
// @desc    Get all hotels
// @access  Public
router.get('/', async (req, res) => {
  try {
    const hotels = readHotelsData(req.dataPath.hotels);
    res.json(hotels);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/hotels/:id
// @desc    Get hotel by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const hotels = readHotelsData(req.dataPath.hotels);
    const hotel = hotels.find(h => h.id === parseInt(req.params.id));

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    res.json(hotel);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/hotels
// @desc    Create a hotel (admin only in a real app)
// @access  Public (for demo purposes)
router.post('/', async (req, res) => {
  const { name, description, location, price, imageUrl } = req.body;

  try {
    const hotels = readHotelsData(req.dataPath.hotels);
    
    const newHotel = {
      id: hotels.length > 0 ? Math.max(...hotels.map(hotel => hotel.id)) + 1 : 1,
      name,
      description,
      location,
      price: parseFloat(price),
      imageUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    hotels.push(newHotel);
    writeHotelsData(req.dataPath.hotels, hotels);

    res.json(newHotel);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
