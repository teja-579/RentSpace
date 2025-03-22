import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUserProfile, getUserProfile } from "../redux/slice/userSlice";
import Navbar from "../components/Navbar";

const Profile = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [editable, setEditable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState(user?.user?.phone || "");
  const [email, setEmail] = useState(user?.user?.email || "");
  const [profileImage, setProfileImage] = useState(user?.user?.profileImagePath || "");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    const startTime = Date.now();
    setLoading(true);
    const formData = new FormData();
    console.log('Appending phone number to FormData:', phone); // Log the phone number being appended

    formData.append('phone', phone);

    const fileInput = document.querySelector('input[type="file"]');
    // Remove duplicate phone number append


    if (fileInput && fileInput.files[0]) {
      formData.append('profileImage', fileInput.files[0]);
    }

    try {
    console.log('FormData before sending:', Array.from(formData.entries())); // Log FormData contents

      await dispatch(updateUserProfile(formData)).unwrap();
      // Fetch updated user data
      const updatedUser = await dispatch(getUserProfile(user.user._id)).unwrap();
      setPhone(updatedUser.phone);
      setEmail(updatedUser.email);
      setProfileImage(updatedUser.profileImagePath);
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      alert(`Profile updated successfully in ${duration} seconds!`);
    } catch (error) {
      console.log('Error:', error);
      alert('Failed to update profile: ' + error.message);
    } finally {
      setLoading(false);
      setEditable(false);
    }
  };

  if (!user?.user) {
    return <div className="text-center">Loading user information...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <img 
                src={profileImage || "/default-profile.png"} 
                alt="Profile" 
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
              />
              {editable && (
                <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer">
                  <input 
                    type="file" 
                    onChange={handleImageChange} 
                    className="hidden"
                    accept="image/*"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </label>
              )}
            </div>
            <h1 className="text-2xl font-bold mt-4">
              {user.user.firstName} {user.user.lastName}
            </h1>
          </div>

          <div className="space-y-6">
            <div className="border-b pb-4">
              <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  {editable ? (
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">{phone}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-gray-900">{email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            {editable ? (
              <>
                <button
                  onClick={() => setEditable(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-75"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditable(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
