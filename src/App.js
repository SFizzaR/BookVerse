import React, { useState } from 'react';
import ReaderPage from './Reader';
import AuthorPage from './Author';
import SearchResult from './searchResult';
import './styles.css'; 
import Modal from './components/modal'; // Import the modal component
import bookimage from './pic.jpg';
import Quote from './components/quotes';
import Section from './components/section';
import FeaturedBooks from './components/featuredBooks';
import FeaturedPosts from './components/popularPost';
import { books2024, summerbooks, classics } from './data/books';
import { FaFacebookF, FaInstagram, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'; // Import Router and Routes

function App() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSignUpMode, setSignUpMode] = useState(false); // Sign In is default
  const [isAuthor, setIsAuthor] = useState(false); // To determine if it's for authors
  const [username, setUsername] = useState(''); // State to track the username
  const [password, setPassword] = useState(''); // State to track the password
  const [errorMessage, setErrorMessage] = useState(''); // State to show error messages
  const [role, setRole] = useState('');
  const [email, setEmail] = useState(''); // State to track the email
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
const [searchType, setSearchType] = useState('title'); // Default search type
const [searchResults, setSearchResults] = useState([]);
const ratingOptions = [0, 1, 2, 3, 4, 5]; // Possible rating options

  const navigate = useNavigate(); // Hook to navigate programmatically

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

  const handleSubmit = async (e) => {
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
  
  
  
  const handleSearch = async () => {
    try {
      const queryParams = [];
      
      // Build query parameters based on searchType and searchTerm
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
      const response = await axios.get(`http://localhost:8002/home/search-books${queryString}`);
      const searchResults = response.data.books || []; // Retrieve books from response


      navigate('/search-results', {
        state: {
          searchResults, // Pass results array
                searchType,
                searchTerm
        }
      });
    } catch (error) {
      console.error('Error fetching search results:', error);
      navigate('/search-results', {
        state: {
          searchResults: [], // Navigate with empty results on error
          searchType,
          searchTerm
        }
      });
    }
  };
  

return (
  <div className='homepage'>
  <nav id="navbar">
      <a href="#">Blog</a>
      <a href="#" onClick={openModalForReaders}>For Readers</a>
      <a href="#" onClick={openModalForAuthors}>For Authors</a>
      <div className="search-bar">
          <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
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
      <div className="start-page">
        <img src={bookimage} className="image-center" alt="Background" />
        <div className="text-container">
          <h1 className="book-cafe">Book Verse</h1>
        </div>
      </div>
  
      <Section title="Top 5 Books of 2024" id="bookList2024" books={books2024} />
      <Section title="Top 5 Summer Reads" id="summerList" books={summerbooks} />
      <Section title="Top 5 Classical Reads" id="ClassicsList" books={classics} />
  
      <FeaturedBooks />
      <FeaturedPosts />
      <Quote />
      <Newsletter />
      <SocialIcons />
  
      {/* Sign In / Sign Up Modal */}
      <Modal isOpen={isModalOpen} closeModal={() => setModalOpen(false)} title={isAuthor ? "For Authors" : "For Readers"}>

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
  
          {errorMessage && <p className="error">{errorMessage}</p>} {/* Display error message */}
  
          <div className="input-container">
            <button type="submit" className="submit">{isSignUpMode ? "Sign Up" : "Sign In"}</button>
          </div>
  
          <p>
            {isSignUpMode ? (
              <>
                Already have an account?{' '}
                <a className='sign' href="#" onClick={() => setSignUpMode(false)}>Sign In</a>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <a className='sign' href="#" onClick={() => setSignUpMode(true)}>Sign Up</a>
              </>
            )}
          </p>
        </form>
      </Modal>
    </div>
  );  
}

function Newsletter() {
  return (
    <div className="newsletter">
      <h4>Sign up to our newsletter</h4>
      <input type="text" placeholder="Enter your email" required />
      <div className="button">
        <button className="Subscribe">Subscribe</button>
      </div>
    </div>
  );
}

function SocialIcons() {
  return (
    <div className="social-icons">
      <a href="https://www.facebook.com">
        <FaFacebookF />
      </a>
      <a href="https://instagram.com">
        <FaInstagram />
      </a>
      <a href="tel:+1234567890" aria-label="Phone">
        <FaPhoneAlt />
      </a>
      <a href="mailto:example@example.com" aria-label="Email">
        <FaEnvelope />
      </a>
    </div>
  
  );

}

export default function MainApp() {
  return (
    <Router>
  <Routes>
    <Route path="/" element={<App />} />
    <Route path="/reader" element={<ReaderPage />} /> {/* Ensure this path and component exist */}
    <Route path="/author" element={<AuthorPage />} /> 
    <Route path="/search-results" element={<SearchResult />} />
  </Routes>
</Router>

  );
}
