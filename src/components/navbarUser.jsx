/*import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faUserFriends, faCalendarAlt, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom"; // For navigation
import axios from "axios"; // For API calls
import "../user.css"; // Ensure styles are included
import avatar from "../assets/avatar.jpg";

const UserNavbar = ({ navbarProfilePic = avatar }) => {
  const [searchType, setSearchType] = useState("title");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

   const handleheaderClick = () => {
    navigate(-1); // Navigate to the previous page
  };

  const handleCalendarClick = () => {
    navigate("/calendar");
  };

  const handleSearch = async () => {
    try {
      const queryParams = [];
      if (searchType === "ratings" && searchTerm) {
        const ratingValue = parseFloat(searchTerm);
        if (!isNaN(ratingValue) && ratingValue >= 0 && ratingValue <= 5) {
          queryParams.push(`minRating=${encodeURIComponent(ratingValue)}`);
        }
      } else if (searchType === "status" && searchTerm) {
        queryParams.push(`status=${encodeURIComponent(searchTerm)}`);
      } else if (searchTerm) {
        queryParams.push(`${searchType}=${encodeURIComponent(searchTerm)}`);
      }

      const queryString = queryParams.length ? `?${queryParams.join("&")}` : "";
      const response = await axios.get(
        `http://localhost:8002/home/search-books${queryString}`
      );

      navigate("/search-results", {
        state: {
          searchResults: response.data.books || [],
          searchType,
          searchTerm,
        },
      });
    } catch (error) {
      console.error("Error fetching search results:", error);
      navigate("/search-results", {
        state: {
          searchResults: [],
          searchType,
          searchTerm,
        },
      });
    }
  };

  return (
    <div id="user-navbar">
       <h2 id="title" onClick={handleheaderClick} style={{ cursor: "pointer" }}>Book Verse</h2>
      <div className="user-search-bar">
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
        <button onClick={handleSearch}>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </div>
      <FontAwesomeIcon
        icon={faCalendarAlt}
        className="icon-style"
        onClick={handleCalendarClick}
      />
      <FontAwesomeIcon icon={faPencilAlt} className="icon-style" />
      <a href="#">
        <img
          src={navbarProfilePic}
          alt="Profile"
          className="small-profile-pic"
          id="profile-pic"
        />
      </a>
    </div>
  );
};

export default UserNavbar;
*/
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faCalendarAlt, faPhone } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom"; // For navigation
import axios from "axios"; // For API calls
import "../user.css"; // Ensure styles are included
import avatar from "../assets/avatar.jpg";

const UserNavbar = ({ navbarProfilePic = avatar }) => {
  const [searchType, setSearchType] = useState("title");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

   const handleheaderClick = () => {
    navigate(-1); // Navigate to the previous page
  };

  const handleCalendarClick = () => {
    navigate("/calendar");
  };

  const handleContactUs = () =>{
    navigate("/Contact_us");
  }

  const handleSearch = async () => {
    try {
      const queryParams = [];
      if (searchType === "ratings" && searchTerm) {
        const ratingValue = parseFloat(searchTerm);
        if (!isNaN(ratingValue) && ratingValue >= 0 && ratingValue <= 5) {
          queryParams.push(`minRating=${encodeURIComponent(ratingValue)}`);
        }
      } else if (searchType === "status" && searchTerm) {
        queryParams.push(`status=${encodeURIComponent(searchTerm)}`);
      } else if (searchTerm) {
        queryParams.push(`${searchType}=${encodeURIComponent(searchTerm)}`);
      }

      const queryString = queryParams.length ? `?${queryParams.join("&")}` : "";
      const response = await axios.get(
        `http://localhost:8002/home/search-books${queryString}`
      );

      navigate("/search-results", {
        state: {
          searchResults: response.data.books || [],
          searchType,
          searchTerm,
        },
      });
    } catch (error) {
      console.error("Error fetching search results:", error);
      navigate("/search-results", {
        state: {
          searchResults: [],
          searchType,
          searchTerm,
        },
      });
    }
  };

  return (
    <div id="user-navbar">
       <h2 id="title" onClick={handleheaderClick} style={{ cursor: "pointer" }}>Book Verse</h2>
      <div className="user-search-bar">
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
        <button onClick={handleSearch}>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </div>
      <FontAwesomeIcon
        icon={faCalendarAlt}
        className="icon-style"
        onClick={handleCalendarClick}
      />
      <FontAwesomeIcon icon={faPhone} className="icon-style" onClick={handleContactUs}/>
      <a href="#">
        <img
          src={navbarProfilePic}
          alt="Profile"
          className="small-profile-pic"
          id="profile-pic"
        />
      </a>
    </div>
  );
};

export default UserNavbar;
