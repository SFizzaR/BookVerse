/*import React, { useState } from 'react';
import ReaderPage from './Reader.js';
import AuthorPage from './Author.js';
import SearchResult from './searchResult';
import AboutUs from './aboutUs.jsx';
import SocailIcons from './components/SocailIcons.js';
import Navbar from './components/navbarHome.js';
import ContactUs from './ContactUs.jsx';
import './styles.css'; 
import Modal from './components/modal'; // Import the modal component
import bookimage from './pic.jpg';
import Quote from './components/quotes';
import Section from './components/section';
import FeaturedBooks from './components/featuredBooks';
//import CallToAction from './components/CallToAction.jsx';
import { books2024, summerbooks, classics } from './data/books';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'; // Import Router and Routes
import CalendarPage from "./EventCaleneder.jsx";
import QuotePage from './Quotes-page.jsx';
import Sparkle from 'react-sparkle';
import Badgepage from './badgePage.jsx';
import CallToAction from './components/CallToAction.jsx'

function App() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSignUpMode, setSignUpMode] = useState(false); // Sign In is default
  const [isAuthor, setIsAuthor] = useState(false); // To determine if it's for authors
  const [username, setUsername] = useState(''); // State to track the username
  const [password, setPassword] = useState(''); // State to track the password
  const [errorMessage, setErrorMessage] = useState(''); // State to show error messages
  const [email, setEmail] = useState(''); // State to track the email
  const [role, setRole] = useState('');

  const navigate = useNavigate(); // Hook to navigate programmatically


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
  


return (
  <div className='homepage'>
<Navbar />

      <div className="start-page">
        <img src={bookimage} className="image-center" alt="Background" />
        <div className="sparkle-container">
                <Sparkle color="yellow" count={250} fadeOut={true} />
            </div>
        <div className="text-container">
          <h1 className="book-cafe">Book Verse</h1>
        </div>
      </div>
  
      <Section title="Top 5 Books of 2024" id="bookList2024" books={books2024} />
      <Section title="Top 5 Summer Reads" id="summerList" books={summerbooks} />
      <Section title="Top 5 Classical Reads" id="ClassicsList" books={classics} />
  
      <FeaturedBooks />
      <CallToAction />
          <Quote />
      <Newsletter />
      <SocailIcons/>
  
      {/* Sign In / Sign Up Modal /}
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
  
          {errorMessage && <p className="error">{errorMessage}</p>} {/* Display error message /}
  
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



export default function MainApp() {
  return (
    <Router>
  <Routes>
    <Route path="/" element={<App />} />
    <Route path="/reader" element={<ReaderPage />} /> {/* Ensure this path and component exist /}
    <Route path="/author" element={<AuthorPage />} /> 
    <Route path="/search-results" element={<SearchResult />} />
    <Route path="/calendar" element={<CalendarPage />} />
    <Route path="/aboutUs" element={<AboutUs />}/>
    <Route path='/Contact_us' element={<ContactUs/>}/>
    <Route path='/quotes' element={<QuotePage/>}/>
    <Route path='/badges' element={<Badgepage/>}/>
  </Routes>
</Router>

  );
}
*/
import React, { useState } from 'react';
import ReaderPage from './Reader.js';
import AuthorPage from './Author.js';
import SearchResult from './searchResult';
import AboutUs from './aboutUs.jsx';
import SocailIcons from './components/SocailIcons.js';
import Navbar from './components/navbarHome.js';
import ContactUs from './ContactUs.jsx';
import './styles.css'; 
import Modal from './components/modal'; // Import the modal component
import bookimage from './pic.jpg';
import Quote from './components/quotes';
import Section from './components/section';
import FeaturedBooks from './components/featuredBooks';
//import CallToAction from './components/CallToAction.jsx';
import { books2024, summerbooks, classics } from './data/books.js';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'; // Import Router and Routes
import CalendarPage from "./EventCaleneder.jsx";
import QuotePage from './Quotes-page.jsx';
import Sparkle from 'react-sparkle';
import Badgepage from './badgePage.jsx';
import CallToAction from './components/CallToAction.jsx'

function App() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSignUpMode, setSignUpMode] = useState(false); // Sign In is default
  const [isAuthor, setIsAuthor] = useState(false); // To determine if it's for authors
  const [username, setUsername] = useState(''); // State to track the username
  const [password, setPassword] = useState(''); // State to track the password
  const [errorMessage, setErrorMessage] = useState(''); // State to show error messages
  const [email, setEmail] = useState(''); // State to track the email
  const [role, setRole] = useState('');

  const navigate = useNavigate(); // Hook to navigate programmatically


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
  


return (
  <div className='homepage'>
<Navbar />

      <div className="start-page">
        <img src={bookimage} className="image-center" alt="Background" />
        <div className="sparkle-container">
                <Sparkle color="yellow" count={250} fadeOut={true} />
            </div>
        <div className="text-container">
          <h1 className="book-cafe">Book Verse</h1>
        </div>
      </div>
  
      <Section title="Top 5 Books of 2024" id="bookList2024" books={books2024} />
      <Section title="Top 5 Summer Reads" id="summerList" books={summerbooks} />
      <Section title="Top 5 Classical Reads" id="ClassicsList" books={classics} />
  
      <FeaturedBooks />
      <CallToAction />
          <Quote />
      <Newsletter />
      <SocailIcons/>
  
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



export default function MainApp() {
  return (
    <Router>
  <Routes>
    <Route path="/" element={<App />} />
    <Route path="/reader" element={<ReaderPage />} /> {/* Ensure this path and component exist */}
    <Route path="/author" element={<AuthorPage />} /> 
    <Route path="/search-results" element={<SearchResult />} />
    <Route path="/calendar" element={<CalendarPage />} />
    <Route path="/aboutUs" element={<AboutUs />}/>
    <Route path='/Contact_us' element={<ContactUs/>}/>
    <Route path='/quotes' element={<QuotePage/>}/>
    <Route path='/badges' element={<Badgepage/>}/>
  </Routes>
</Router>

  );
}
