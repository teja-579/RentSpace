import Booking from "../models/booking.model.js"

export const createBooking = async (req, res, next) => {
  try {
    // Prevent booking functionality
    return res.status(403).json({ message: "Booking functionality is currently disabled." });
  } catch (error) {
    next(error);
  }
}
