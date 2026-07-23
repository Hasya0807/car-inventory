const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const TestDrive = require('../models/TestDrive');
const Vehicle = require('../models/Vehicle');
const ActivityLog = require('../models/ActivityLog');

const router = express.Router();

// Get booked slots for a specific vehicle on a specific date
router.get('/:vehicleId/booked-slots', async (req, res, next) => {
  try {
    const { vehicleId } = req.params;
    const { date } = req.query; // YYYY-MM-DD
    
    if (!date) {
      return res.status(400).json({ success: false, message: 'Date is required' });
    }

    const testDrives = await TestDrive.find({ vehicleId, date, status: 'Scheduled' }).select('slot');
    const bookedSlots = testDrives.map(td => td.slot);
    
    res.status(200).json({ success: true, data: bookedSlots });
  } catch (error) {
    next(error);
  }
});

// Book a test drive
router.post('/book', protect, async (req, res, next) => {
  try {
    const { vehicleId, date, slot, contactNumber } = req.body;
    const userId = req.user._id;

    // Validate inputs
    if (!vehicleId || !date || !slot || !contactNumber) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Verify vehicle exists
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    // Rule 1: One person can book only one test drive of an individual car
    const existingVehicleBooking = await TestDrive.findOne({ 
      userId, 
      vehicleId, 
      status: 'Scheduled' 
    });
    if (existingVehicleBooking) {
      return res.status(400).json({ success: false, message: 'You already have a scheduled test drive for this vehicle.' });
    }

    // Rule 2: A person cannot book a test drive of another car at the same date and time
    const overlappingTimeBooking = await TestDrive.findOne({ 
      userId, 
      date, 
      slot, 
      status: 'Scheduled' 
    });
    if (overlappingTimeBooking) {
      return res.status(400).json({ success: false, message: 'You already have another test drive scheduled at this date and time.' });
    }

    try {
      const testDrive = await TestDrive.create({
        userId,
        vehicleId,
        date,
        slot,
        contactNumber
      });

      await ActivityLog.create({
        userId,
        action: 'Test Drive Booked',
        vehicleId,
        details: { date, slot }
      });

      res.status(201).json({ success: true, data: testDrive, message: 'Test drive scheduled successfully' });
    } catch (err) {
      // E11000 duplicate key error means this slot was just booked by someone else
      if (err.code === 11000) {
        return res.status(409).json({ success: false, message: 'This time slot is no longer available. Please select another time.' });
      }
      throw err;
    }
  } catch (error) {
    next(error);
  }
});

// Get user's scheduled test drives
router.get('/me', protect, async (req, res, next) => {
  try {
    const testDrives = await TestDrive.find({ userId: req.user._id })
      .populate('vehicleId', 'make model year imageUrl price')
      .sort({ date: 1, slot: 1 });
      
    const validTestDrives = testDrives.filter(td => td.vehicleId);
    res.status(200).json({ success: true, data: validTestDrives });
  } catch (error) {
    next(error);
  }
});

// Admin: Get all test drives
router.get('/all', protect, admin, async (req, res, next) => {
  try {
    const testDrives = await TestDrive.find({})
      .populate('userId', 'name email phone')
      .populate('vehicleId', 'make model year imageUrl')
      .sort({ date: 1, slot: 1 });
      
    res.status(200).json({ success: true, data: testDrives });
  } catch (error) {
    next(error);
  }
});

// Admin: Update test drive status
router.put('/:id/status', protect, admin, async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['Scheduled', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const testDrive = await TestDrive.findById(req.params.id);
    if (!testDrive) {
      return res.status(404).json({ success: false, message: 'Test drive not found' });
    }

    testDrive.status = status;
    await testDrive.save();

    await ActivityLog.create({
      userId: req.user._id,
      action: `Test Drive ${status}`,
      vehicleId: testDrive.vehicleId,
      details: { testDriveId: testDrive._id }
    });

    res.status(200).json({ success: true, data: testDrive });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
