import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaArrowLeft, FaArrowRight, FaHeart } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { setWishList } from "../redux/slice/userSlice"

const ListingCard = (props) => {
  const {
    listingId,
    creator,
    listingPhotoPaths,
    city,
    state,
    country,
    category,
    type,
    price,
    booking,
    startDate,
    endDate,
    totalPrice,
  } = props;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageError, setImageError] = useState({});
  const [wishlistError, setWishlistError] = useState(null);
  const [bookingError, setBookingError] = useState(null);

  const navigate = useNavigate();

  const goToPrevSlide = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + listingPhotoPaths.length) % listingPhotoPaths.length
    );
  };

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % listingPhotoPaths.length);
  };

  // wishlist
  const user = useSelector((state) => state?.user?.user);
  const wishList = user?.wishList || [];
  const isAddToWishList = wishList?.find((item) => item?._id === listingId);
  const dispatch = useDispatch();

  const handleImageError = (index) => {
    setImageError((prev) => ({
      ...prev,
      [index]: true,
    }));
  };

  const patchWishList = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user?._id === creator._id) {
      setWishlistError("You cannot add your own listing to wishlist");
      setTimeout(() => setWishlistError(null), 3000);
      return;
    }

    try {
      setWishlistError(null);
      const response = await fetch(
        `http://localhost:9999/api/user/${user?._id}/${listingId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update wishlist");
      }

      const data = await response.json();
      dispatch(setWishList(data.wishList));
    } catch (error) {
      console.error("Wishlist error:", error);
      setWishlistError("Failed to update wishlist");
      setTimeout(() => setWishlistError(null), 3000);
    }
  };

  return (
    <div
      className="relative cursor-pointer p-2.5 rounded-lg hover:shadow-lg w-72"
      onClick={() => {
        navigate(`/listings/${listingId}`);
      }}
    >
      <div className="w-72 overflow-hidden rounded-lg mb-2.5">
        <div
          className="flex w-full items-center transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {listingPhotoPaths?.map((photo, index) => {
            const imageUrl = `http://localhost:9999/${photo.replace(/\\/g, '/').replace(/public\//g, '')}`;
            console.log("Constructed image URL:", imageUrl); // Log the constructed image URL
            return (
              <div
                className="relative flex-none w-full h-64 flex items-center"
                key={index}
              >
                <img
                  src={imageUrl}
                  alt={`Property ${index + 1}`}
                  className="w-full h-full brightness-90 object-cover"
                  onError={() => handleImageError(index)}
                  style={{ display: imageError[index] ? 'none' : 'block' }}
                />
                {imageError[index] && (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                    Image not available
                  </div>
                )}

                <div
                  className="absolute top-1/2 transform -translate-y-1/2 p-1.5 rounded-full border-none cursor-pointer flex items-center justify-center bg-white/70 z-50 hover:bg-white left-2.5"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevSlide();
                  }}
                >
                  <FaArrowLeft className="font-[15px]" />
                </div>

                <div
                  className="absolute top-1/2 transform -translate-y-1/2 p-1.5 rounded-full border-none cursor-pointer flex items-center justify-center bg-white/70 z-50 hover:bg-white right-2.5"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNextSlide();
                  }}
                >
                  <FaArrowRight className="font-[15px]" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-700">
        {city}, {state}, {country}
      </h3>

      <p className="text-base text-slate-700">{category}</p>

      {!booking ? (
        <>
          <p className="text-base text-slate-700">{type}</p>
          <p className="text-base text-slate-700">
            <span className="font-bold text-lg text-slate-700">₹{price}</span>{" "}
            per night
          </p>
        </>
      ) : (
        <>
          <p className="text-base text-slate-700">
            {startDate} - {endDate}
          </p>
          <p className="text-base text-slate-700">
            <span className="font-bold text-lg text-slate-700">
              ₹{totalPrice}
            </span>{" "}
            total
          </p>
        </>
      )}

      {wishlistError && (
        <div className="absolute top-14 right-2 bg-red-100 text-red-600 p-2 rounded text-sm">
          {wishlistError}
        </div>
      )}

      {bookingError && (
        <div className="absolute top-14 right-2 bg-red-100 text-red-600 p-2 rounded text-sm">
          {bookingError}
        </div>
      )}

      <button
        className={`absolute right-5 top-5 border-none text-2xl cursor-pointer z-[999] bg-none ${
          isAddToWishList ? "text-red-500" : "text-white"
        } hover:scale-110 transition-transform`}
        onClick={(e) => {
          e.stopPropagation();
          patchWishList();
        }}
        title={user ? "Add to wishlist" : "Login to add to wishlist"}
      >
        <FaHeart />
      </button>
    </div>
  );
};

export default ListingCard;