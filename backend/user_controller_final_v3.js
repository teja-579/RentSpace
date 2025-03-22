import bcrypt from "bcryptjs"; // Import bcrypt for password hashing
import User from "../models/user.model.js"; // Adjust the path as necessary
import Listing from "../models/listing.model.js"; // Import Listing model
import Booking from "../models/booking.model.js"; // Import Booking model

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Return user data (excluding password)
    const { password: _, ...userData } = user._doc;
    res.status(200).json(userData);
  } catch (error) {
    next(error);
  }
};

// Add the addListingToWishList function export
export const addListingToWishList = async (req, res, next) => {
  const { userId, listingId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found!" });
    }

    const favoriteListing = user.wishList.find(
      (item) => item._id.toString() === listingId
    );

    if (favoriteListing) {
      user.wishList = user.wishList.filter(
        (item) => item._id.toString() !== listingId
      );
      await user.save();
      res.status(200).json({
        message: "Listing removed from wishlist",
        wishList: user.wishList,
      });
    } else {
      user.wishList.push(listing);
      await user.save();
      res.status(200).json({
        message: "Listing added to wishlist",
        wishList: user.wishList,
      });
    }
  } catch (error) {
    next(error);
  }
};

// Add the getPropertyList function export
export const getPropertyList = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const properties = await Listing.find({ creator: userId }).populate("creator");
    res.status(200).json(properties);
  } catch (error) {
    next(error);
  }
};

// Add the getTripList function export
export const getTripList = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const trips = await Booking.find({ customerId: userId }).populate("customerId hostId listingId");
    res.status(200).json(trips);
  } catch (error) {
    next(error);
  }
};
