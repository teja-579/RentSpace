import React, { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import { useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { setListings } from "../redux/slice/listingSlice"
import ListingCard from "../components/ListingCard"

const SearchPage = () => {
  const { search } = useParams()
  const [loading, setLoading] = useState(true)

  const listings = useSelector((state) => state.listings.listings)
  const dispatch = useDispatch()

  const getSearchListings = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `http://localhost:9999/api/listing/search/${search}`,
        { method: "GET" }
      )

      const data = await response.json()
      console.log("Search API Response:", data); // Log the API response

      dispatch(setListings({ listings: data.listings || [] })); // Ensure listings is an array
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getSearchListings()
  }, [search])

  return (
    <>
      <Navbar />

      <h1 className="text-2xl font-bold text-slate-700 my-10 mx-[100px] sm:mx-12">
        Search results for: {search}
      </h1>

      {loading && (
        <div className="px-24 pb-28 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-500"></div>
        </div>
      )}
      
      {!loading && listings.length === 0 && (
        <div className="px-24 pb-28 flex justify-center">
          <p className="text-xl text-slate-500">No results found for "{search}"</p>
        </div>
      )}
      
      {!loading && listings.length > 0 && (
        <div className="px-24 pb-28 flex justify-center flex-wrap gap-6">
          {Array.isArray(listings) && listings.map(
          ({
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
              key={_id} // Added unique key prop
              listingId={_id}
              creator={creator}
              listingPhotoPaths={listingPhotoPaths}
              city={city}
              state={state}
              country={country}
              category={category}
              type={type}
              price={price}
              booking={booking}
            />
          )
          )}
        </div>
      )}
    </>
  )
}

export default SearchPage
