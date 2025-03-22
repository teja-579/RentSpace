import React, { useEffect, useState } from "react"
import { categories } from "../data"
import { useDispatch, useSelector } from "react-redux"
import { setListings } from "../redux/slice/listingSlice"
import ListingCard from "./ListingCard"

const Listings = () => {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [bookingError, setBookingError] = useState(null)

  const listings = useSelector((state) => state?.listings?.listings)
  const user = useSelector((state) => state.user.user)
  const dispatch = useDispatch()

  const getListings = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(
        selectedCategory !== "All"
          ? `http://localhost:9999/api/listing?category=${selectedCategory}`
          : "http://localhost:9999/api/listing",
        {
          method: "GET",
        }
      )

      if (!res.ok) {
        throw new Error("Failed to fetch listings")
      }

      const { listings } = await res.json()
      dispatch(setListings({ listings }))
    } catch (error) {
      console.error("Error fetching listings:", error)
      setError("Failed to load listings. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleBooking = (creatorId) => {
    const userId = user?._id;
    if (userId === creatorId) {
      setBookingError("You cannot book your own property");
      setTimeout(() => setBookingError(null), 3000);
      return;
    }
    // Proceed with booking logic here
  };

  useEffect(() => {
    getListings()
  }, [selectedCategory])

  return (
    <>
      <div className="px-20 py-12 md:px-5 flex justify-center flex-wrap gap-14">
        {categories.map((category) => (
          <div
            className={`flex flex-col items-center text-slate-900 cursor-pointer transition-colors duration-200 hover:text-red-500`}
            key={category.label}
            onClick={() => setSelectedCategory(category.label)}
          >
            <div
              className={`text-2xl ${
                category.label === selectedCategory ? "text-red-500" : ""
              }`}
            >
              {category.icon}
            </div>

            <p
              className={`text-lg font-bold ${
                category.label === selectedCategory ? "text-red-500" : ""
              }`}
            >
              {category.label}
            </p>
          </div>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-700"></div>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-center py-8">
          {error}
          <button 
            onClick={getListings}
            className="ml-2 text-blue-500 hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      <div className="px-12 pb-32 lg:px-5 flex flex-wrap justify-center gap-5">
        {!loading && !error && Array.isArray(listings) && listings.length > 0 ? (
          listings.map(({
            _id,
            creator,
            listingPhotoPaths,
            city,
            state,
            country,
            category,
            type,
            price,
            booking = false,
          }) => (
            <ListingCard
              key={_id}
              listingId={_id}
              creator={creator}
              listingPhotoPaths={listingPhotoPaths.map(path => path.replace(/\\/g, '/'))}
              city={city}
              state={state}
              country={country}
              category={category}
              type={type}
              price={price}
              booking={booking}
              onBook={() => handleBooking(creator)} // Pass the creator ID to the booking handler
            />
          ))
        ) : !loading && !error ? (
          <div className="text-center py-8 text-slate-500">
            No listings found for this category
          </div>
        ) : null}
      </div>
    </>
  )
}

export default Listings