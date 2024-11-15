import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditProfile.css';

const EditProfile = ({ onClose }) => {
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    bio: '',
  });

  useEffect(() => {
    axios.get('/api/profile') // Replace with your actual API endpoint
      .then((response) => setProfileData(response.data))
      .catch((error) => console.error('Error fetching profile data:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put('/api/profile', profileData) // Replace with your actual API endpoint
      .then(() => {
        alert('Profile updated successfully!');
        onClose(); // Close the Edit Profile form after submission
      })
      .catch((error) => console.error('Error updating profile:', error));
  };

  return (
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={profileData.username}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={profileData.email}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Bio</label>
          <textarea
            name="bio"
            value={profileData.bio}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="save-button">Save Changes</button>
       
      </form>
    </div>
  );
};

export default EditProfile;
