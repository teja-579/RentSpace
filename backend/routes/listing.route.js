import express from "express"
import multer from "multer"
import {
  createListing,
  getListingDetails,
  getListings,
  getListingsBySearch,
} from "../controller/listing.controller.js"

// multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/")
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  },
})

const upload = multer({ storage })

const router = express.Router()

// New route to get all listings
router.get("/all", async (req, res) => {
  try {
    const listings = await Listing.find().populate("creator");
    console.log("All Listings:", listings); // Log all listings
    res.status(200).json(listings);
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).json({ message: "Error fetching listings" });
  }
});

router.post("/create", upload.array("listingPhotos"), createListing)
router.get("/", getListings)
router.get("/:listingId", getListingDetails)
router.get("/search/:search", getListingsBySearch)

export default router