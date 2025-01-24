import React, { useState, useEffect,useRef } from "react";
import "./user.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { faUserFriends, faCalendarAlt, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import avatar from './assets/avatar.jpg';
import EditProfile from "./EditProfile";
import UserNavbar from "./components/navbarUser";

import Slider from "react-slick";

export function Author() {
  const [profilePic, setProfilePic] = useState(avatar);
  const [isEditing, setIsEditing] = useState(false);
  const [badge, setBadge] = useState(null);

  const [readingList, setReadingList] = useState({
    currentlyReading: [],
    read: [],
    wantToRead: [],
  });
  const [error, setError] = useState(null);
  const [arrowVisibility, setArrowVisibility] = useState({
    currentlyReading: { left: false, right: false },
    read: { left: false, right: false },
    wantToRead: { left: false, right: false },
  });
  //const [badgeFilename, setBadgeFilename] = useState(null);
  const currentlyReadingRef = useRef(null);
  const readRef = useRef(null);
  const wantToReadRef = useRef(null);

  const location = useLocation();
  const username = location.state?.username;
  const authorId = location.state?.authorId || null; // Get authorId from location state

  const checkArrows = (listId, ref) => {
    const scrollable = ref.current;
    if (scrollable) {
      setArrowVisibility((prev) => ({
        ...prev,
        [listId]: {
          left: scrollable.scrollLeft > 0,
          right: scrollable.scrollLeft + scrollable.clientWidth < scrollable.scrollWidth,
        },
      }));
    }
  };

  useEffect(() => {
    const fetchReadingList = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          setError("User is not authenticated");
          return;
        }

        const response = await axios.get("http://localhost:8002/reader/getreadinglist", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setReadingList(response.data); // Update the state with fetched data
      } catch (err) {
        console.error("Error fetching reading list:", err);
        setError("Failed to fetch the reading list");
      }
    };

    fetchReadingList();
    const handleResize = () => {
      checkArrows("currentlyReading", currentlyReadingRef);
      checkArrows("read", readRef);
      checkArrows("wantToRead", wantToReadRef);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleScroll = (listId, ref) => {
    checkArrows(listId, ref);
  };

  const scrollList = (direction, ref) => {
    const scrollable = ref.current;
    const scrollAmount = 200;
    if (scrollable) {
      scrollable.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };




  const navigate = useNavigate(); // Initialize navigate



  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newProfilePic = event.target.result;
        setProfilePic(newProfilePic);
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchBadge = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        console.error("User not authenticated");
        return;
      }

      const response = await axios.get("http://localhost:8002/badges/fetchUserBadge", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        setBadge(response.data); // Save badge data
      }
    } catch (error) {
      console.error("Error fetching badge:", error);
    }
  };

  useEffect(() => {
    fetchBadge(); // Fetch badge on component mount
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }
  
      console.log('Sending logout request...');
      const response = await axios.post("http://localhost:8002/author/logout", {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      console.log('Server response:', response); // Ensure response is correct
  
      if (response.status === 200) {
        console.log("Logout successful:", response.data);
  
        // Remove token and role from localStorage
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('role');
        
        console.log('Tokens and role removed:', localStorage.getItem('jwtToken'), localStorage.getItem('role'));
  
        navigate('/'); // Navigate to the homepage or a different route after logout
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
    

  return (
    <div className="author-page">
      <UserNavbar/>
      <div className="side-bar">
        <h2>My Profile</h2>
        <img src={profilePic} alt="Profile" className="profile-pic" id="profile-pic" onClick={() => document.getElementById('file-input').click()} />
        <input type="file" id="file-input" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
        <h4 id="username">{username}</h4>
        <h5>Badges</h5>
        {badge ? (
        <div>
          <img
            src={`/${badge.badge_icon}`} // Access the image in the public folder
            style={{ width: "160px", height: "160px" }}
          />
         
        </div>
      ) : (
        <p>No badge earned yet.</p>
      )}


        <button onClick={() => setIsEditing((prev) => !prev)} className="edit-profile-button">
          {isEditing ? "Cancel Edit" : "Edit Profile"}
        </button>
        {isEditing && <EditProfile />}
        <button className="logout-button" onClick={handleLogout}>Log Out</button>
      </div>
      <div className="content-wrapper">
        <h1>My Reading List</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* Currently Reading */}
        <h2>Currently Reading</h2>
        <div className="scroll-container">
          <button
            className="scroll-arrow left"
            onClick={() => scrollList("left", currentlyReadingRef)}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <div className="book-list" ref={currentlyReadingRef}>
            {readingList.currentlyReading.map((book, index) => (
              <div key={index} className="book-item">
                <img src={book.image} alt="Book Cover" className="book-cover" />
                <p className="book-title">{book.title}</p>
                <p className="book-author">{book.author}</p>
              </div>
            ))}
          </div>
          <button
            className="scroll-arrow right"
            onClick={() => scrollList("right", currentlyReadingRef)}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>

        {/* Read */}
        <h2>Read</h2>
        <div className="scroll-container">
          <button
            className="scroll-arrow left"
            onClick={() => scrollList("left", readRef)}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <div className="book-list" ref={readRef}>
            {readingList.read.map((book, index) => (
              <div key={index} className="book-item">
                <img src={book.image} alt="Book Cover" className="book-cover" />
                <p className="book-title">{book.title}</p>
              </div>
            ))}
          </div>
          <button
            className="scroll-arrow right"
            onClick={() => scrollList("right", readRef)}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>

        {/* Want to Read */}
        <h2>Want to Read</h2>
        <div className="scroll-container">
          <button
            className="scroll-arrow left"
            onClick={() => scrollList("left", wantToReadRef)}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <div className="book-list" ref={wantToReadRef}>
            {readingList.wantToRead.map((book, index) => (
              <div key={index} className="book-item">
                <img src={book.image} alt="Book Cover" className="book-cover" />
                <p className="book-title">{book.title}</p>
              </div>
            ))}
          </div>
          <button
            className="scroll-arrow right"
            onClick={() => scrollList("right", wantToReadRef)}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>
         
    

    </div>
  );
};

export default Author;
