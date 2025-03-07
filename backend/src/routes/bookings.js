const express = require('express');
const router = express.Router();
const fs = require('fs');
const auth = require('../middleware/auth');

// Helper function to read bookings data
const readBookingsData = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading bookings data:', error);
    return [];
  }
};

// Helper function to write bookings data
const writeBookingsData = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing bookings data:', error);
    return false;
  }
};

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

// @route   GET api/bookings
// @desc    Get all bookings for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const bookings = readBookingsData(req.dataPath.bookings);
    const hotels = readHotelsData(req.dataPath.hotels);
    
    // Filter bookings by user ID and include hotel details
    const userBookings = bookings
      .filter(booking => booking.userId === req.user.user.id)
      .map(booking => {
        const hotel = hotels.find(h => h.id === booking.hotelId);
        return {
          ...booking,
          hotel: hotel || null
        };
      });
      
    res.json(userBookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/bookings/:id
// @desc    Get booking by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const bookings = readBookingsData(req.dataPath.bookings);
    const hotels = readHotelsData(req.dataPath.hotels);
    
    // Find booking by ID
    const booking = bookings.find(b => b.id === parseInt(req.params.id));

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if the booking belongs to the user
    if (booking.userId !== req.user.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Include hotel details
    const hotel = hotels.find(h => h.id === booking.hotelId);
    const bookingWithHotel = {
      ...booking,
      hotel: hotel || null
    };

    res.json(bookingWithHotel);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/bookings
// @desc    Create a booking
// @access  Private
router.post('/', auth, async (req, res) => {
  const { hotelId, checkIn, checkOut, guests } = req.body;

  try {
    const bookings = readBookingsData(req.dataPath.bookings);
    const hotels = readHotelsData(req.dataPath.hotels);
    
    // Find the hotel
    const hotel = hotels.find(h => h.id === parseInt(hotelId));
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    
    // Create new booking
    const newBookingId = bookings.length > 0 ? Math.max(...bookings.map(booking => booking.id)) + 1 : 1;
    
    // Create guests with IDs
    const newGuests = guests.map((guest, index) => ({
      id: newBookingId * 100 + index, // Generate unique IDs for guests
      name: guest.name,
      aadhaarNo: null
    }));
    
    const newBooking = {
      id: newBookingId,
      userId: req.user.user.id,
      hotelId: parseInt(hotelId),
      checkIn: new Date(checkIn).toISOString(),
      checkOut: new Date(checkOut).toISOString(),
      status: 'pending',
      guests: newGuests,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add booking to array and save
    bookings.push(newBooking);
    writeBookingsData(req.dataPath.bookings, bookings);
    
    // Return booking with hotel details
    const bookingWithHotel = {
      ...newBooking,
      hotel
    };

    res.json(bookingWithHotel);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/bookings/:id/check-in
// @desc    Check-in for a booking
// @access  Private
router.put('/:id/check-in', auth, async (req, res) => {
  const { guests } = req.body;

  try {
    const bookings = readBookingsData(req.dataPath.bookings);
    const hotels = readHotelsData(req.dataPath.hotels);
    
    // Find booking by ID
    const bookingIndex = bookings.findIndex(b => b.id === parseInt(req.params.id));
    
    if (bookingIndex === -1) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    const existingBooking = bookings[bookingIndex];
    
    // Check if the booking belongs to the user
    if (existingBooking.userId !== req.user.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Update the booking status and guest Aadhaar numbers
    const updatedBooking = {
      ...existingBooking,
      status: 'checked-in',
      updatedAt: new Date().toISOString(),
      guests: existingBooking.guests.map((guest, index) => ({
        ...guest,
        aadhaarNo: guests[index]?.aadhaarNo || guest.aadhaarNo
      }))
    };
    
    // Update the booking in the array
    bookings[bookingIndex] = updatedBooking;
    writeBookingsData(req.dataPath.bookings, bookings);
    
    // Include hotel details in response
    const hotel = hotels.find(h => h.id === updatedBooking.hotelId);
    const bookingWithHotel = {
      ...updatedBooking,
      hotel: hotel || null
    };

    res.json(bookingWithHotel);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/bookings/:id/cancel
// @desc    Cancel a booking
// @access  Private
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const bookings = readBookingsData(req.dataPath.bookings);
    const hotels = readHotelsData(req.dataPath.hotels);
    
    // Find booking by ID
    const bookingIndex = bookings.findIndex(b => b.id === parseInt(req.params.id));
    
    if (bookingIndex === -1) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    const existingBooking = bookings[bookingIndex];
    
    // Check if the booking belongs to the user
    if (existingBooking.userId !== req.user.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Update the booking status
    const updatedBooking = {
      ...existingBooking,
      status: 'cancelled',
      updatedAt: new Date().toISOString()
    };
    
    // Update the booking in the array
    bookings[bookingIndex] = updatedBooking;
    writeBookingsData(req.dataPath.bookings, bookings);
    
    // Include hotel details in response
    const hotel = hotels.find(h => h.id === updatedBooking.hotelId);
    const bookingWithHotel = {
      ...updatedBooking,
      hotel: hotel || null
    };

    res.json(bookingWithHotel);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
