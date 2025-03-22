import React from 'react';
import { Link } from 'react-router-dom';

const NavbarUpdated = () => {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
      <Link to="/profile">Profile</Link> {/* Added Profile Link */}
      <Link to="/create-listing">Create Listing</Link>
    </nav>
  );
};

export default NavbarUpdated;
