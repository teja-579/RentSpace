import express from 'express';
import Booking from '../models/booking.model.js';

const router = express.Router();

router.get('/insert-test-reservation', async (req, res) => {
  try {
    const testReservation = new Booking({
      customerId: '67a094f367f0e15ec78b7bb0', // Valid ObjectId for customer
      hostId: '67c0069c4b3d14a707e938cf', // Valid ObjectId for host
      listingId: 'someListingId', // Replace with a valid listing ObjectId
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
