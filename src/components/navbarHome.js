import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from './modal'; // Adjust import path for your Modal component
import { AuthProvider } from '../AuthContext'; // Adjust import path for your AuthProvider

const Navbar = () => {
  const navigate = useNavigate();

  // State variables
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSignUpMode, setSignUpMode] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [searchType, setSearchType] = useState('title');
  const [searchTerm, setSearchTerm] = useState('');

  // Handlers
  const handleHome = () =>{
    navigate('/');
  }
  const openModalForReaders = () => {
    setIsAuthor(false);
    setSignUpMode(false); // Default to Sign In mode
    setRole('reader'); // Set role to reader
    setModalOpen(true);
  };

  const openModalForAuthors = () => {
    setIsAuthor(true);
    setSignUpMode(false); // Default to Sign In mode
    setRole('author'); // Set role to author
    setModalOpen(true);
  };

  const handleUsernameChange = (e) => {
    const inputValue = e.target.value.replace(/\s/g, ''); // Remove spaces from input
    setUsername(inputValue);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };


// If using a select or radio button for role
const handleRoleChange = (e) => {
    setRole(e.target.value);
};


 /* const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }
  
    try {
      const apiUrl = isSignUpMode ? 'http://localhost:8002/home/signup' : 'http://localhost:8002/home/login';
  
      const payload = {
        username,
        password,
        role,
      };
  
      if (isSignUpMode) {
        payload.email = email;
      }
  
      const response = await axios.post(apiUrl, payload);
  
      // Check if the response data contains the token (login case)
      const { token } = response.data;
      if (!token) {
        throw new Error("Token not received from server");
      }
  
      localStorage.setItem('jwtToken', token);
      setErrorMessage('');
  
      // Redirect after successful signup or login
      if (role === 'reader') {
        navigate('/reader', { state: { username } });
      } else if (role === 'author') {
        navigate('/author', { state: { username } });
      }
  
    } catch (error) {
      // Log the error message from the backend response
      console.error('Error:', error.response ? error.response.data : error.message);
  
      // Check for specific error messages
      if (error.response && error.response.data.error === 'User not found') {
        setErrorMessage('User not found. Please sign up instead.');
      } else {
        setErrorMessage('An error occurred. Please try again.');
      }
    }
  };
*/
const handleSubmit = async (e) => {
  e.preventDefault();

  // Validate password length
  if (password.length < 8) {
    setErrorMessage('Password must be at least 8 characters long.');
    return;
  }

  try {
    const apiUrl = isSignUpMode ? 'http://localhost:8002/home/signup' : 'http://localhost:8002/home/login';

    // Prepare payload with username, password, email (if sign up), and role
    const payload = {
      username,
      password,
      role, // Ensure role is passed directly here
    };

    if (isSignUpMode) {
      payload.email = email; // Only include email on signup
    }

    // Send request
    const response = await axios.post(apiUrl, payload);

    // Handle response (expecting token and role)
    const { token } = response.data;
    if (!token) {
      throw new Error("Token not received from server");
    }

    // Store the token and role in localStorage
    localStorage.setItem('jwtToken', token);
    localStorage.setItem('role', role); // Ensure role is saved too

    setErrorMessage('');

    // Redirect to appropriate page based on role
    if (role === 'reader') {
      navigate('/reader', { state: { username } });
    } else if (role === 'author') {
      navigate('/author', { state: { username } });
    }

  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    setErrorMessage('An error occurred. Please try again.');
  }
};


  const handleSearch = async () => {
    try {
      const queryParams = [];

      if (searchType === 'ratings' && searchTerm) {
        const ratingValue = parseFloat(searchTerm);
        if (!isNaN(ratingValue) && ratingValue >= 0 && ratingValue <= 5) {
          queryParams.push(`minRating=${encodeURIComponent(ratingValue)}`);
        } else {
          console.error('Rating must be a number between 0 and 5');
          return;
        }
      } else if (searchTerm) {
        queryParams.push(`${searchType}=${encodeURIComponent(searchTerm)}`);
      }

      const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';
      const response = await axios.get(
        `http://localhost:8002/home/search-books${queryString}`
      );
      const searchResults = response.data.books || [];

      navigate('/search-results', {
        state: {
          searchResults,
          searchType,
          searchTerm,
        },
      });
    } catch (error) {
      console.error('Error fetching search results:', error);
      navigate('/search-results', {
        state: {
          searchResults: [],
          searchType,
          searchTerm,
        },
      });
    }
  };

  const handleAboutUs = () => {
    navigate('/aboutUs');
  };

  // JSX
  return (
    <AuthProvider>
      <nav id="navbar">
      <a href="#" onClick={openModalForReaders}>
            For Readers
          </a>
          <a href="#" onClick={openModalForAuthors}>
            For Authors
          </a>
        <div className="pages">
        
        <a href="#" onClick={handleHome}>Home</a>
        <a href="#" onClick={handleAboutUs}>
            About Us
          </a>
          <a href="#">Blog</a>
          <a href='#'>Contact Us</a>
          
         
        </div>
        <div className="search-bar">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value="title">Title</option>
            <option value="author">Author</option>
            <option value="genre">Genre</option>
            <option value="ratings">Rating</option>
          </select>
          <input
            type="text"
            placeholder={`Search by ${searchType}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      </nav>

      {/* Sign In / Sign Up Modal */}
      <Modal
        isOpen={isModalOpen}
        closeModal={() => setModalOpen(false)}
        title={isAuthor ? 'For Authors' : 'For Readers'}
      >
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <input
              type="text"
              placeholder="Username"
              className="username"
              value={username}
              onChange={handleUsernameChange}
              required
            />
          </div>

          {isSignUpMode && (
            <div className="input-container">
              <input
                type="email"
                placeholder="Email"
                className="email"
                value={email}
                onChange={handleEmailChange}
                required
              />
            </div>
          )}

          <div className="input-container">
            <input
              type="password"
              placeholder="Password"
              className="password"
              value={password}
              onChange={handlePasswordChange}
              minLength={8}
              required
            />
          </div>

          {errorMessage && <p className="error">{errorMessage}</p>}

          <div className="input-container">
            <button type="submit" className="submit">
              {isSignUpMode ? 'Sign Up' : 'Sign In'}
            </button>
          </div>

          <p>
            {isSignUpMode ? (
              <>
                Already have an account?{' '}
                <a href="#" onClick={() => setSignUpMode(false)}>
                  Sign In
                </a>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <a href="#" onClick={() => setSignUpMode(true)}>
                  Sign Up
                </a>
              </>
            )}
          </p>
        </form>
      </Modal>
    </AuthProvider>
  );
};

export default Navbar;
