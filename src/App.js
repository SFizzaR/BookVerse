import React, { useState } from 'react';
import './styles.css'; 
import Modal from './components/modal'; // Import the modal component
import Sparkle from 'react-sparkle';
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
      const apiUrl = isSignUpMode ? 'http://localhost:8002/signup' : 'http://localhost:8002/login';

      const payload = {
        username,
        password,
        role,
      };

      // Include email only for signup
      if (isSignUpMode) {
        payload.email = email;
      }

      const response = await axios.post(apiUrl, payload);
      const { token } = response.data;
      localStorage.setItem('jwtToken', token);
      console.log('Login/Signup successful:', response.data);
      setErrorMessage('');

      // Redirect after successful signup or login
      if (role === 'reader') {
        navigate('/Reader'); // Redirect to reader.js equivalent page
      } //else if (role === 'author') {
       // navigate('/author'); // Redirect to author.js equivalent page
      //}

    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <nav id="navbar">
        <a href="#">Blog</a>
        <a href="#" onClick={openModalForReaders}>For Readers</a>
        <a href="#" onClick={openModalForAuthors}>For Authors</a>
        <div className="search-bar">
          <input type="text" placeholder=" Search by title, author, or keyword..." />
          <button type="submit">Search</button>
        </div>
      </nav>

      <div className="start-page">
        <Sparkle count={30} color="yellow" fadeDuration={1000} />
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
                <a href="#" onClick={() => setSignUpMode(false)}>Sign In</a>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <a href="#" onClick={() => setSignUpMode(true)}>Sign Up</a>
              </>
            )}
          </p>
        </form>
      </Modal>
    </div>
  );
}

function ReaderPage() {
  return <h1>Welcome to the Reader Page!</h1>; // Your reader.js logic
}

function AuthorPage() {
  return <h1>Welcome to the Author Page!</h1>; // Your author.js logic
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
        <Route path="/reader" element={<ReaderPage />} /> {/* Reader Page Route */}
        <Route path="/author" element={<AuthorPage />} /> {/* Author Page Route */}
      </Routes>
    </Router>
  );
}
