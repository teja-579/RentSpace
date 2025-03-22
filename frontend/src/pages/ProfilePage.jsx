import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }
        const response = await axios.get('http://localhost:9999/api/user/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.user);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    // Implement update logic here
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Profile Page</h1>
      <form onSubmit={handleUpdate}>
        <input type="text" value={user.firstName} onChange={(e) => setUser({ ...user, firstName: e.target.value })} />
        <input type="text" value={user.lastName} onChange={(e) => setUser({ ...user, lastName: e.target.value })} />
        <input type="email" value={user.email} readOnly />
        <input type="text" value={user.phone} onChange={(e) => setUser({ ...user, phone: e.target.value })} />
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default ProfilePage;
