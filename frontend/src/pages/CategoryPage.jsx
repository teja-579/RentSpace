import React, { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import { useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { setListings } from "../redux/slice/listingSlice"
import ListingCard from "../components/ListingCard"

const CategoryPage = () => {
  const { category } = useParams()

  const listings = useSelector((state) => state.listings.listings)

  //   console.log(listings)

  const dispatch = useDispatch()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const getListingsByCategory = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const res = await fetch(
        `http://localhost:9999/api/listing?category=${category}`,
        {
          method: "GET",
        }
      )

      const { listings } = await res.json()
      
      if (!Array.isArray(listings)) {
        throw new Error('Invalid listings data format')
      }

      dispatch(setListings({ listings }))
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getListingsByCategory()
  }, [category])

  return (
    <>
      <Navbar />

      <h1 className="text-2xl font-bold text-slate-700 my-10 mx-[100px] sm:mx-12 uppercase">
        {category} Listings
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-[50vh]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 mt-10">{error}</div>
      ) : listings && listings.length > 0 ? (
        <div className="px-24 pb-28 flex justify-center flex-wrap gap-6">
          {listings.map(listing => (
            <ListingCard
              key={listing._id}
              listingId={listing._id}
              creator={listing.creator}
              listingPhotoPaths={listing.listingPhotoPaths}
              city={listing.city}
              state={listing.state}
              country={listing.country}
              category={listing.category}
              type={listing.type}
              price={listing.price}
              booking={listing.booking || false}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-10">No listings found</div>
      )}
    </>
  )
}

export default CategoryPage
