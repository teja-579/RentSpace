import Listing from "../models/listing.model.js"
import { errorHandler } from "../utils/error.js"

export const createListing = async (req, res, next) => {
  try {
    console.log("Request body:", req.body); // Log the request body
    console.log("Uploaded files:", req.files); // Log the uploaded files

    const {
      creator,
      category,
      type,
      streetAddress,
      aptSuite,
      city,
      state,
      country,
      guestCount,
      bedroomCount,
      bedCount,
      bathroomCount,
      amenities,
      title,
      description,
      price,
    } = req.body;

    const listingPhotos = req.files;
    if (!listingPhotos || listingPhotos.length === 0) {
      console.error("No files uploaded");
      return res.status(400).json({ message: "No files uploaded" });
    }

    const listingPhotoPaths = listingPhotos.map((file) => 
      file.path.replace(/\\/g, '/').replace('backend/public/uploads/', 'uploads/')
    );

    const newListing = new Listing({
      creator,
      category,
      type,
      streetAddress,
      aptSuite,
      city,
      state,
      country,
      guestCount,
      bedroomCount,
      bedCount,
      bathroomCount,
      amenities,
      listingPhotoPaths,
      title,
      description,
      price,
    });

    await newListing.save();

    res.status(201).json(newListing);
  } catch (error) {
    console.error("Error creating listing:", error);
    next(error);
  }
}

import mongoose from "mongoose";

export const getListingDetails = async (req, res, next) => {
  try {
    const { listingId } = req.params;
    
    // Validate listingId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return next(errorHandler(400, "Invalid listing ID"));
    }

    const listing = await Listing.findById(listingId).populate("creator");
    
    if (!listing) {
      return next(errorHandler(404, "Listing not found"));
    }

    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
}

export const getListings = async (req, res, next) => {
  const qCategory = req.query.category;

  try {
    let listings;

    if (qCategory) {
      listings = await Listing.find({ category: qCategory }).populate("creator");
    } else {
      listings = await Listing.find().populate("creator");
    }

    // Ensure the response is properly formatted
    res.status(200).json({ listings }); // Wrap listings in an object
  } catch (error) {
    next(error);
  }
}

export const getListingsBySearch = async (req, res, next) => {
  const { search } = req.params;

  try {
    console.log("Search term:", search); // Log the search term
    let listings = [];

    if (!search || search === "all") {
      listings = await Listing.find().populate("creator");
    } else {
      let query = {
        $or: [
          { category: { $regex: search, $options: "i" } },
          { title: { $regex: search, $options: "i" } },
          { city: { $regex: search, $options: "i" } },
          { state: { $regex: search, $options: "i" } },
          { country: { $regex: search, $options: "i" } },
        ],
      };

      if (!isNaN(search)) {
        console.log("Searching for price:", search); // Log the price search
        query.$or.push({ price: Number(search) }); // Only include if search is a valid number
      }

      listings = await Listing.find(query).populate("creator");
    }

    console.log("Listings found:", listings); // Log the listings before sending the response
    res.status(200).json({ listings }); // Wrap listings in an object
  } catch (error) {
    console.error("Error during search:", error); // Log the error
    next(error);
  }
}
