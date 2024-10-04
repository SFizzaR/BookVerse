import React, { useState, useEffect } from "react";
import "./reader.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserFriends, faCalendarAlt, faPencilAlt } from '@fortawesome/free-solid-svg-icons';

export function Reader( ) {
  const [profilePic, setProfilePic] = useState("https://via.placeholder.com/150");
  const [navbarProfilePic, setNavbarProfilePic] = useState("https://via.placeholder.com/40");
  const [modalVisible, setModalVisible] = useState(false);

  const books2024 = [
    {
      id: "book1",
      title: "The Housemaid is Watching",
      image: "https://book-shelf.pk/cdn/shop/files/TheHousemaidIsWatchingbyFreidaMcFadden.jpg?v=1719916402",
    },
    {
      id: "book2",
      title: "Eruption",
      image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1699720827i/199372731.jpg",
    },
    {
      id: "book3",
      title: "Swan Song",
      image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1698505960i/200484931.jpg",
    },
    {
      id: "book4",
      title: "Dad, I Want to Hear Your Story",
      image: "https://m.media-amazon.com/images/I/51ZvZFJOsrL._AC_UF1000,1000_QL80_.jpg",
    },
  ];

  const currentReads = [
    {
      id: "book1",
      title: "As Good As Dead",
      image: "https://friendsbook.pk/cdn/shop/files/9781405298612_67a65aa0-a2ba-4670-bc5c-108a884bda42.webp?v=1702059099",
    },
    {
      id: "book2",
      title: "Unsouled",
      image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1654571019i/30558257.jpg",
    },
  ];

  const tbr = [
    {
      id: "book1",
      title: "The Silent Patient",
      image: "https://book-shelf.pk/cdn/shop/files/383765699_972040427418031_3870065130882927535_n.jpg?v=1695575089",
    },
    {
      id: "book2",
      title: "Other Words For Home",
      image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1539183359i/35398627.jpg",
    },
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newProfilePic = event.target.result;
        setProfilePic(newProfilePic);
        setNavbarProfilePic(newProfilePic);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <div className="reader-page">
      <div id="navbar">
        <h2 id="title">Book Verse</h2>
        <div className="search-bar">
          <input type="text" placeholder=" Search by title, author, or keyword..." />
          <button type="submit">Search</button>
        </div>
        <FontAwesomeIcon icon={faUserFriends} className="icon-style" />
      <FontAwesomeIcon icon={faCalendarAlt} className="icon-style" />
      <FontAwesomeIcon icon={faPencilAlt} className="icon-style" />
        <a href="#">
        <img src={navbarProfilePic} alt="Profile" className="profile-pic" id="profile-pic"/>
        </a>
      </div>

      <div className="side-bar">
        <h2>My Profile</h2>
        <img src={profilePic} alt="Profile" className="profile-pic" id="profile-pic" onClick={() => document.getElementById('file-input').click()} />
        <input type="file" id="file-input" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
        <h4 id="username">Fizzy</h4>
        <h5>Badges</h5>
        <button className="edit-profile-button">Edit Profile</button>
        <button className="logout-button">Log Out</button>
      </div>

      <div className="content-wrapper">
        <button className="filter-button" id="filterBtn" onClick={toggleModal}>Show Filters</button>
        <div className="container">
          <div className="section">
          <p>Loading items...</p>
          </div>
        </div>

        <div className="recommended-list">
          <h2 className="header">Recommended Books</h2>
          <div className="book-list" id="recommended-book-list">
            {books2024.map((book) => (
              <div className="book" key={book.id}>
                <img src={book.image} alt={book.title} width="100" />
              </div>
            ))}
          </div>
        </div>

        <div className="current-reads">
          <h2 className="header">Current Reads</h2>
          <h2 className="number">2</h2>
        </div>
          <div className="book-list" id="current-read-list">
            {currentReads.map((book) => (
              <div className="book" key={book.id}>
                <img src={book.image} alt={book.title} width="100" />
              </div>
            ))}
            <div className="add-more">+ Add More</div>
          </div>
      

        <div className="to-be-read">
          <div className="tbr">
            <h2 className="header">To Be Read</h2>
            <h2 className="number">2</h2>
          </div>
          <div className="book-list" id="to-be-read-list">
            {tbr.map((book) => (
              <div className="book" key={book.id}>
                <img src={book.image} alt={book.title} width="100" />
              </div>
            ))}
            <div className="add-more">+ Add More</div>
          </div>
        </div>
      </div>

      {modalVisible && (
        <div id="filterModal" className="modal">
          <div className="modal-content">
            <span className="close" id="closeModal" onClick={toggleModal}>&times;</span>
            <h3>Filters</h3>
            <div className="filters">
              <div className="filter-group">
                <label htmlFor="genre">Genre:</label>
                <select id="genre">
                  <option value="">Select Genre</option>
                  <option value="fiction">Fiction</option>
                  <option value="fantasy">Fantasy</option>
                  <option value="self-help">Self-Help</option>
                  <option value="mystry/thriller">Mystry/Thriller</option>
                  <option value="science-fiction">Science Fiction</option>
                  <option value="non-fiction">Non-Fiction</option>
                  <option value="horror">Horror</option>
                  <option value="historical-fiction">Historical Fiction</option>
                  <option value="young adult">Young Adult</option>
                  <option value="children's-book">Children's Book</option>
                </select>
              </div>
              <div className="filter-group">
                <label htmlFor="age-range">Age Range:</label>
                <select id="age-range">
                  <option value="">Select Age Range</option>
                  <option value="adult">Adult (18+)</option>
                  <option value="young-adult">Young Adult (13-18)</option>
                  <option value="middle-grade">Middle Grade (8-12)</option>
                  <option value="children">Children's (4-7)</option>
                  <option value="picture-books">Picture Books (0-3)</option>
                </select>
              </div>
              <div className="filter-group">
                <label htmlFor="rating">Rating:</label>
                <select id="rating">
                  <option value="">Select Rating</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
            </div>
            <button type="submit" id="Apply">Apply all</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reader;
