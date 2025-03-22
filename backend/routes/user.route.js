import express from "express"
import {
  addListingToWishList,
  getPropertyList,
  getReservationList,
  getTripList,
  updateProfile,
  loginUser, // Import the login function
  getUserProfile, // Import the getUserProfile function
} from "../controller/user.controller.js";

const router = express.Router()

router.get("/:userId/trips", getTripList)

router.patch("/:userId/:listingId", addListingToWishList)

router.get("/:userId/properties", getPropertyList)

router.get("/:userId/reservations", getReservationList)
router.patch("/:userId/profile", updateProfile)
router.get("/:userId/profile", getUserProfile);
// router.get("/profile", getUserProfile);

export default router
