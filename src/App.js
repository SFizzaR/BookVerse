import React from 'react';
import './styles.css'; 
import Sparkle from 'react-sparkle'
import bookimage from './book.png'
import Quote from './components/quotes'
import Section from './components/section';
import FeaturedBooks from './components/featuredBooks';
import FeaturedPosts from './components/popularPost'
import { books2024, summerbooks, classics } from './data/books';
import { FaFacebookF, FaInstagram, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

function App() {
  return (
    <div>
      <nav id="navbar">
        <a href="#">Blog</a>
        <a href="#">Sign in</a>
        <a href="#">Sign up</a>
      </nav>

      <div className="start-page">
      <Sparkle count={30} color="yellow" fadeDuration={1000}>
      </Sparkle>
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
    </div>
  );
}

function Newsletter() {
  return (
    <div className="newsletter">
      <h4>Sign up to our newsletter</h4>
      <input type="text" placeholder="Enter your email" />
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
