import React, { useState, useEffect, useRef } from "react";
import "./user.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import avatar from '../assets/avatar.jpg';
import EditProfile from "./EditProfile";
import expert from '../assets/expert.png';
import Navbar from "../components/navbarUser";
const api = axios.create({
  baseURL: "http://localhost:8002",
});

export function Reader() {
  const [profilePic, setProfilePic] = useState(avatar);
  const [isEditing, setIsEditing] = useState(false);
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

  const currentlyReadingRef = useRef(null);
  const readRef = useRef(null);
  const wantToReadRef = useRef(null);
  const fileInputRef = useRef(null);

  const location = useLocation();
  const username = location.state?.username;
  const navigate = useNavigate();

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

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

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


  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8002/reader/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );

      if (response.status === 200) {
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("role");
        navigate("/#");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="reader-page">
      
<Navbar />
      <div className="side-bar">
        <h2>My Profile</h2>
        <img
          src={profilePic}
          alt="Profile"
          className="profile-pic"
          id="profile-pic"
          onClick={() => document.getElementById("file-input").click()}
        />
        <input type="file" id="file-input" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
        <h4 id="username">{username}</h4>
        <h5>Badges</h5>
        <img src={expert} id="expert-bage"></img>
        <button className="see-more-button" onClick={() => navigate("/badges")}>
    See More
  </button>
        <button onClick={() => setIsEditing((prev) => !prev)} className="edit-profile-button">
          {isEditing ? "Cancel Edit" : "Edit Profile"}
        </button>
        {isEditing && <EditProfile />}
        <button className="logout-button" onClick={handleLogout}>
          Log Out
        </button>
      </div>

      <div className="content-wrapper">
        <h1>My Reading List</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
{/* Currently Reading */}
<h2>Currently Reading</h2>
        <div className="book-list" id="currently-reading-list">
          {arrowVisibility.currentlyReading.left && (
            <button
              className="scroll-arrow left"
              onClick={() => scrollList("left", currentlyReadingRef)}
            >
              ←
            </button>
          )}
          <div
            className="scroll-items"
            ref={currentlyReadingRef}
            onScroll={() => handleScroll("currentlyReading", currentlyReadingRef)}
          >
            {readingList.currentlyReading.map((book, index) => (
              <div key={index} className="book-item">
                <img src={book.image} alt="Book Cover" className="book-cover" />
                <span className="delete-icon">
                  <FontAwesomeIcon icon={faTrash} />
                </span>
                <p className="book-title">{book.title}</p>
              </div>
            ))}
          </div>
          {arrowVisibility.currentlyReading.right && (
            <button
              className="scroll-arrow right"
              onClick={() => scrollList("right", currentlyReadingRef)}
            >
              →
            </button>
          )}
        </div>

        {/* Read */}
        <h2>Read</h2>
        <div className="book-list" id="read-list">
          {arrowVisibility.read.left && (
            <button className="scroll-arrow left" onClick={() => scrollList("left", readRef)}>
              ←
            </button>
          )}
          <div
            className="scroll-items"
            ref={readRef}
            onScroll={() => handleScroll("read", readRef)}
          >
            {readingList.read.map((book, index) => (
              <div key={index} className="book-item">
                <img src={book.image} alt="Book Cover" className="book-cover" />
                <p className="book-title">{book.title}</p>
              </div>
            ))}
          </div>
          {arrowVisibility.read.right && (
            <button className="scroll-arrow right" onClick={() => scrollList("right", readRef)}>
              →
            </button>
          )}
        </div>

        {/* Want to Read */}
        <h2>Want to Read</h2>
        <div className="book-list" id="want-to-read-list">
          {arrowVisibility.wantToRead.left && (
            <button className="scroll-arrow left" onClick={() => scrollList("left", wantToReadRef)}>
              ←
            </button>
          )}
          <div
            className="scroll-items"
            ref={wantToReadRef}
            onScroll={() => handleScroll("wantToRead", wantToReadRef)}
          >
            {readingList.wantToRead.map((book, index) => (
              <div key={index} className="book-item">
                <img src={book.image} alt="Book Cover" className="book-cover" />
                <p className="book-title">{book.title}</p>
              </div>
            ))}
          </div>
          {arrowVisibility.wantToRead.right && (
            <button
              className="scroll-arrow right"
              onClick={() => scrollList("right", wantToReadRef)}
            >
              →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
export default Reader;


