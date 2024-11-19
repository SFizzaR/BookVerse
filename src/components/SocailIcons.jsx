import React from 'react';
import { FaFacebookF, FaInstagram, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import '../styles.css';

const SocialIcons = () => {
  return (
    <div className="social-icons">
        <p>&copy; 2024 Literature Quotes. All rights reserved.</p>
        <div className='icons'>
      <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
        <FaFacebookF />
      </a>
      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
        <FaInstagram />
      </a>
      <a href="tel:+1234567890" aria-label="Phone">
        <FaPhoneAlt />
      </a>
      <a href="mailto:example@example.com" aria-label="Email">
        <FaEnvelope />
      </a>
      </div>
    </div>
  );
};

export default SocialIcons;
