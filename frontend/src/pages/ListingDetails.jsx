import React, { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import { useNavigate, useParams } from "react-router-dom"
import { facilities } from "../data"
import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"
import { DateRange } from "react-date-range"
import { useSelector } from "react-redux"

const ListingDetails = () => {
  const { listingId } = useParams()
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [bookingError, setBookingError] = useState(null)
  const [bookingLoading, setBookingLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageErrors, setImageErrors] = useState({})

  const getListingDetails = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `http://localhost:9999/api/listing/${listingId}`,
        {
          method: "GET",
        }
      )

      if (!response.ok) {
        throw new Error("Failed to fetch listing details")
      }

      const data = await response.json()
      setListing(data)
    } catch (error) {
      console.error("Error fetching listing:", error)
      setError("Failed to load listing details. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getListingDetails()
  }, [listingId])

  // Calendar
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ])

  const handleSelect = (ranges) => {
    setDateRange([ranges.selection])
  }

  const start = new Date(dateRange[0].startDate)
  const end = new Date(dateRange[0].endDate)
  const dayCount = Math.round(end - start) / (1000 * 60 * 60 * 24)

  // Booking
  const customerId = useSelector((state) => state?.user?.user?._id)
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!customerId) {
      navigate('/login')
      return
    }

    // Check if the property belongs to the logged-in user
    if (listing.creator._id === customerId) {
      setIsModalOpen(true);
      return; // Prevent booking for own property
    }

    setBookingLoading(true)
    setBookingError(null)

    try {
      const bookingForm = {
        customerId,
        listingId,
        hostId: listing.creator._id,
        startDate: dateRange[0].startDate.toDateString(),
        endDate: dateRange[0].endDate.toDateString(),
        totalPrice: listing.price * dayCount,
      }

      const response = await fetch("http://localhost:9999/api/booking/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingForm),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to create booking")
      }

      navigate(`/${customerId}/trips`)
    } catch (error) {
      console.error("Booking error:", error)
      setBookingError(error.message || "Failed to create booking. Please try again.")
    } finally {
      setBookingLoading(false)
    }
  }

  const handleImageError = (index) => {
    setImageErrors(prev => ({
      ...prev,
      [index]: true
    }))
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-700"></div>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[60vh] px-4">
          <p className="text-red-500 text-center mb-4">{error}</p>
          <button
            onClick={getListingDetails}
            className="text-white bg-slate-700 px-4 py-2 rounded hover:bg-slate-600"
          >
            Try Again
          </button>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="px-5 py-10 lg:px-12">
        <div className="flex justify-between items-center sm:flex-col sm:items-start sm:gap-4">
          <h1 className="text-2xl font-bold text-slate-700">
            {listing?.title}
          </h1>
        </div>

        <div className="flex flex-wrap gap-2.5 my-5">
          {listing?.listingPhotoPaths?.map((item, index) => (
            <div key={index} className="max-h-[280px] max-w-[280px] relative">
              {!imageErrors[index] ? (
                <img
                  src={`http://localhost:9999/${item.replace(/\\/g, '/').replace(/public\//g, '')}`}
                  alt={`listing photo ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={() => handleImageError(index)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                  Image not available
                </div>
              )}
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold text-slate-700">
          {listing?.type} in {listing?.city}, {listing?.state}, {listing?.country}
        </h2>

        <p className="max-w-[800px] mt-5 text-slate-700">
          {listing?.guestCount} guests - {listing?.bedroomCount} bedroom(s) -{" "}
          {listing?.bedCount} bed(s) - {listing?.bathroomCount} bathroom(s)
        </p>

        <hr className="my-4 border-gray-300" />

        <div className="flex gap-5 items-center">
          <div className="w-[60px] h-[60px] overflow-hidden rounded-full">
            <img
              src={`http://localhost:9999/${listing?.creator?.profileImagePath.replace("public", "")}`}
              alt="Host"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/60x60?text=Host"
              }}
            />
          </div>
          <h3 className="text-slate-700 font-semibold">
            Owned by {listing?.creator?.firstName} {listing?.creator?.lastName}
          </h3>
          <p className="text-slate-600 text-l">
            Email: {listing?.creator?.email}
          </p>
          <p className="text-slate-600">
            Phone: {listing?.creator?.phone}
          </p>
        </div>

        <hr className="my-4 border-gray-300" />

        <h3 className="text-xl font-bold text-slate-700">Description</h3>
        <p className="max-w-[800px] mt-5 text-slate-700">
          {listing?.description}
        </p>

        <hr className="my-4 border-gray-300" />

        <div className="flex flex-col lg:flex-row justify-between lg:gap-12">
          <div>
            <h2 className="text-xl font-bold text-slate-700">Amenities</h2>
            <div className="grid grid-cols-2 gap-x-5 sm:gap-x-24 my-7 max-w-[700px]">
              {listing?.amenities[0]?.split(",").map((item, index) => (
                <div
                  className="flex items-center gap-5 text-lg font-semibold mb-5"
                  key={index}
                >
                  <div className="text-2xl text-slate-700">
                    {facilities.find((facility) => facility.name === item)?.icon}
                  </div>
                  <p className="m-0 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-slate-700 mb-4">
              Book Your Stay
            </h2>

            <div className="space-y-4">
              <DateRange
                ranges={dateRange}
                onChange={handleSelect}
                minDate={new Date()}
              />

              <div className="space-y-2">
                <h3 className="font-semibold">
                  ₹{listing?.price} x {dayCount} {dayCount > 1 ? 'nights' : 'night'}
                </h3>

                <h2 className="font-bold text-slate-700">
                  Total price: ₹{listing?.price * dayCount}
                </h2>

                <div className="text-sm text-slate-600">
                  <p>Check-in: {dateRange[0].startDate.toDateString()}</p>
                  <p>Check-out: {dateRange[0].endDate.toDateString()}</p>
                </div>

                {bookingError && (
                  <p className="text-red-500 text-sm">{bookingError}</p>
                )}

                <button
                  className="w-full mt-4 text-white bg-slate-700 p-3 rounded-lg hover:bg-slate-600 disabled:opacity-70 disabled:cursor-not-allowed uppercase transition duration-200"
                  onClick={handleSubmit}
                  disabled={bookingLoading || !customerId}
                >
                  {bookingLoading ? "Processing..." : customerId ? "Book Now" : "Sign in to Book"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <span className="cursor-pointer float-right text-xl" onClick={() => setIsModalOpen(false)}>&times;</span>
            <p className="text-center">You cannot book your own property.</p>
          </div>
        </div>
      )}
    </>
  )
}

export default ListingDetails
