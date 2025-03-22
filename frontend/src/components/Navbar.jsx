import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { IoMdMenu } from "react-icons/io";
import { setLogout } from "../redux/slice/userSlice";

const Navbar = () => {
  const user = useSelector((state) => state.user);
  const [dropdownMenu, setDropdownMenu] = useState(false);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const getProfileImageUrl = (imagePath) => {
    if (!imagePath) return null;
    // Handle base64 encoded images
    if (imagePath.startsWith('data:')) {
      return imagePath;
    }
    // Handle file paths
    return `http://localhost:9999/${imagePath.replace(/^public[\/\\]/, '')}`;
  };

  const handleLogout = () => {
    dispatch(setLogout());
    setDropdownMenu(false);
    navigate("/login");
  };

  return (
    <div className="py-[10px] sm:py-[10px] px-[20px] sm:px-[60px] flex justify-between items-center relative ">
      <Link to={"/"}>
        <h1 className="text-slate-500 text-3xl font-bold">
          Rent
          <span className="text-slate-900">Space</span>
        </h1>
      </Link>

      <div className="flex border border-gray-500 rounded-[30px] h-[50px] px-5 gap-10 items-center">
        <input
          type="text"
          placeholder="Search..."
          className="focus:outline-none bg-transparent"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          disabled={search.trim() === ""}
          onClick={() => navigate(`/listings/search/${search}`)}
        >
          <FaSearch className="text-slate-600 w-6 h-6" />
        </button>
      </div>

      <div className="flex items-center gap-5">
        {user?.user ? (
          <Link
            to={"/create-listing"}
            className="hidden sm:block no-underline text-slate-500 font-bold cursor-pointer hover:text-blue-500"
          >
            Become A Host
          </Link>
        ) : (
          <div>
            <Link
              to={"/register"}
              className="w-full px-4 py-2 text-slate-500 no-underline font-bold hover:text-blue-500"
              onClick={() => setDropdownMenu(false)}
            >
              Register
            </Link>
            <Link
              to={"/login"}
              className="w-full px-4 py-2 text-slate-500 no-underline font-bold hover:text-blue-500"
              onClick={() => setDropdownMenu(false)}
            >
              Login
            </Link>
          </div>
        )}

        <button
          onClick={() => setDropdownMenu(!dropdownMenu)}
          className="h-[50px] flex items-center px-[10px] border border-gray-500 rounded-[30px] gap-2.5 bg-white cursor-pointer hover:shadow-lg"
        >
          <IoMdMenu className="text-slate-600" />
          {!user?.user ? (
            <FaUser className="text-slate-600" />
          ) : (
            <img
              src={getProfileImageUrl(user.user?.profileImagePath) || "/default-profile.png"}
              alt="profile"
              className="w-10 h-10 object-cover rounded-full"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/default-profile.png";
              }}
            />
          )}
        </button>

        {dropdownMenu && user?.user && (
          <div className="absolute bg-white right-15 sm:right-5 top-20 flex flex-col w-48 p-2.5 border border-gray-300 rounded-2xl shadow-lg z-[999]">
            <Link
              to={`/${user.user._id}/profile`}
              className="w-full px-4 py-2 text-slate-500 no-underline font-bold hover:text-blue-500"
              onClick={() => setDropdownMenu(false)}
            >
              Profile
            </Link>
            <Link
              to={`/${user.user._id}/reservations`}
              className="w-full px-4 py-2 text-slate-500 no-underline font-bold hover:text-blue-500"
              onClick={() => setDropdownMenu(false)}
            >
              Reservation List
            </Link>
            <Link
              to={`/${user.user._id}/trips`}
              className="w-full px-4 py-2 text-slate-500 no-underline font-bold hover:text-blue-500"
              onClick={() => setDropdownMenu(false)}
            >
              Trip List
            </Link>
            <Link
              to={`/${user.user._id}/wishList`}
              className="w-full px-4 py-2 text-slate-500 no-underline font-bold hover:text-blue-500"
              onClick={() => setDropdownMenu(false)}
            >
              Wish List
            </Link>
            <Link
              to={`/${user.user._id}/properties`}
              className="w-full px-4 py-2 text-slate-500 no-underline font-bold hover:text-blue-500"
              onClick={() => setDropdownMenu(false)}
            >
              Property List
            </Link>
            <button
              className="w-full px-4 py-2 text-left text-slate-500 font-bold hover:text-blue-500"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
