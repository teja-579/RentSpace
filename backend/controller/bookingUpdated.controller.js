import Booking from "../models/booking.model.js"

export const createBooking = async (req, res, next) => {
  try {
    const { customerId, hostId, listingId, startDate, endDate, totalPrice } = req.body;

    // Check if the user is trying to book their own property
    if (customerId === hostId) {
      return res.status(400).json({ message: "You cannot book your own property." });
    }

    const newBooking = new Booking({
      customerId,
      hostId,
      listingId,
      startDate,
      endDate,
      totalPrice,
    });

    await newBooking.save();

    res.status(200).json(newBooking);
  } catch (error) {
    next(error);
  }
}
