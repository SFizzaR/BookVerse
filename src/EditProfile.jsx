import React, { useState } from 'react';
import axios from 'axios';
import './EditProfile.css'

const EditProfile = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleProfileUpdate = async () => {
    const token = localStorage.getItem('jwtToken');

    if (!token) {
      setError('User is not authenticated');
      return;
    }

    try {
      // Prepare data to send to the backend
      const updatedData = { username, email, bio };

      // Make the PUT request to update the profile
      const response = await axios.put('http://localhost:8002/profile/profile', updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(response.data.message); // Success message
      setError(''); // Clear any existing errors

      // Optionally, clear the form after a successful update
      setUsername('');
      setEmail('');
      setBio('');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.error || 'An error occurred while updating the profile');
    }
  };

  return (
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleProfileUpdate();
        }}
      >
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter new username"
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter new email"
            required
          />
        </div>
        <div className="form-group">
          <label>Bio:</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Enter new bio"
            required
          />
        </div>
        <button type="submit" className="save-button">Update Profile</button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default EditProfile;
