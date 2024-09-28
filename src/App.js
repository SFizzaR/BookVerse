import React, { useState } from 'react';
import './styles.css'; 
import Modal from './components/modal'; // Import the modal component
import Sparkle from 'react-sparkle';
import bookimage from './book.png';
import Quote from './components/quotes';
import Section from './components/section';
import FeaturedBooks from './components/featuredBooks';
import FeaturedPosts from './components/popularPost';
import { books2024, summerbooks, classics } from './data/books';
import { FaFacebookF, FaInstagram, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

function App() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSignUpMode, setSignUpMode] = useState(false); // Sign In is default
  const [isAuthor, setIsAuthor] = useState(false); // To determine if it's for authors
  const [username, setUsername] = useState(''); // State to track the username
  const [password, setPassword] = useState(''); // State to track the password
  const [errorMessage, setErrorMessage] = useState(''); // State to show error messages

  const openModalForReaders = () => {
    setIsAuthor(false);
    setSignUpMode(false); // Default to Sign In mode
    setModalOpen(true);
  };

  const openModalForAuthors = () => {
    setIsAuthor(true);
    setSignUpMode(false); // Default to Sign In mode
    setModalOpen(true);
  };

  const handleUsernameChange = (e) => {
    const inputValue = e.target.value.replace(/\s/g, ''); // Remove spaces from input
    setUsername(inputValue);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }
    // Perform the form submission logic here
    console.log('Form submitted successfully');
    setErrorMessage(''); // Clear error message on successful submission
  };

  return (
    <div>
      <nav id="navbar">
        <a href="#">Blog</a>
        <a href="#" onClick={openModalForReaders}>For Readers</a>
        <a href="#" onClick={openModalForAuthors}>For Authors</a>
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
              <input type="email" placeholder="Email" className="email" required />
            </div>
          )}

          <div className="input-container">
            <input
              type="password"
              placeholder="Password"
              className="password"
              value={password}
              onChange={handlePasswordChange}
              minLength={8} // HTML validation for password length
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

export default App;
