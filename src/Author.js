import React, { useState, useEffect } from "react";
import "./user.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserFriends, faCalendarAlt, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

export function Author( ) {
  const [profilePic, setProfilePic] = useState("https://via.placeholder.com/150");
  const [navbarProfilePic, setNavbarProfilePic] = useState("https://via.placeholder.com/40");
  const [searchType, setSearchType] = useState('title');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  

  const location = useLocation();  // Get the state from the navigate function
  const username = location.state?.username;
  
  const handleSearch = async () => {
    try {
        const queryParams = [];

        // Check if the search type is ratings and add the searchTerm to minRating
        if (searchType === 'ratings' && searchTerm) {
            const ratingValue = parseFloat(searchTerm); // Parse as float
            if (!isNaN(ratingValue) && ratingValue >= 0 && ratingValue <= 5) {
                queryParams.push(`minRating=${encodeURIComponent(ratingValue)}`);
            } else {
                console.error('Rating must be a number between 0 and 5');
                return; // Return early if the rating is invalid
            }
        } else if (searchTerm) {
            if (searchType === 'title') {
                queryParams.push(`title=${encodeURIComponent(searchTerm)}`);
            } else if (searchType === 'author') {
                queryParams.push(`author=${encodeURIComponent(searchTerm)}`);
            } else if (searchType === 'genre') {
                queryParams.push(`genre=${encodeURIComponent(searchTerm)}`);
            }
        }

        const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';
        const response = await axios.get(`http://localhost:8002/home/search-books${queryString}`);
        setSearchResults(response.data); 
    } catch (error) {
        console.error('Error fetching search results:', error);
        setSearchResults([]);
    }
};


  const navigate = useNavigate(); // Initialize navigate

  const Mybooks = [
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

  const MySeries = [
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
let booksNum = Mybooks.length;
let seriesNum = MySeries.length;
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


  // Define handleLogout function
  const handleLogout = async () => {
    try {
      const response = await axios.post("http://localhost:8002/reader/logout", {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.status === 200) {
        console.log("Logout successful:", response.data);
        localStorage.removeItem('token'); // Clear token from storage
        navigate('/#'); // Redirect to login page after logout
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };


  return (
    <div className="reader-page">
      <div id="reader-navbar">
        <h2 id="title">Book Verse</h2>
        <div className="reader-search-bar">
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
        <FontAwesomeIcon icon={faUserFriends} className="icon-style" />
      <FontAwesomeIcon icon={faCalendarAlt} className="icon-style" />
      <FontAwesomeIcon icon={faPencilAlt} className="icon-style" />
        <a href="#">
        <img src={navbarProfilePic} alt="Profile" className="small-profile-pic" id="profile-pic"/>
        </a>
      </div>

      <div className="side-bar">
        <h2>My Profile</h2>
        <img src={profilePic} alt="Profile" className="profile-pic" id="profile-pic" onClick={() => document.getElementById('file-input').click()} />
        <input type="file" id="file-input" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
        <h4 id="username">{username}</h4>
        
        <h5>Badges</h5>
        <button className="edit-profile-button">Edit Profile</button>
        <button className="logout-button" onClick={handleLogout}>Log Out</button> {/* Call handleLogout on click */}
      </div>

      <div className="content-wrapper">
        <div className="container">
          <div className="section">
          <p>Loading items...</p>
          </div>
        </div>

       
        <div className="My-books">
        <div className="header-container">
    <h2 className="header">Current Reads</h2>
    <h2 className="number">{booksNum}</h2>
  </div>
       
          <div id="my-book-list" >
            {currentReads.map((book) => (
              <div className="books" key={book.id}>
                <img src={book.image} alt={book.title} width="100" />
              </div>
            ))}
            <div className="add-more">+ Add More</div>
          </div>
          </div>
       

        <div className="my-series">
         
          <div className="header-container">
    <h2 className="header">Current Reads</h2>
    <h2 className="number">{seriesNum}</h2>
  </div>
        
         
          <div id="my-series-list">
            {tbr.map((book) => (
              <div className="books" key={book.id}>
                <img src={book.image} alt={book.title} width="100" />
              </div>
            ))}
            <div className="add-more">+ Add More</div>
          </div>
        
        </div>
      </div>
    </div>
   
  );
};

export default Author;
