import express from 'express';
import Booking from '../models/booking.model.js';

const router = express.Router();

router.post('/create-test-reservation', async (req, res) => {
  try {
    const testReservation = new Booking({
      customerId: '67a094f367f0e15ec78b7bb0', // Replace with actual ObjectId
      hostId: '67c0069c4b3d14a707e938cf', // Replace with actual ObjectId
      listingId: 'someListingId', // Replace with actual ObjectId
      startDate: '2024-11-01',
      endDate: '2024-11-10',
      totalPrice: 500,
    });

    await testReservation.save();
    res.status(201).json({ message: 'Test reservation created successfully', reservation: testReservation });
  } catch (error) {
    console.error('Error creating test reservation:', error);
    res.status(500).json({ message: 'Error creating test reservation', error });
  }
});

export default router;
