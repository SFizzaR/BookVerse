
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './search.css';
import { jwtDecode } from 'jwt-decode';


function SearchResults() {
  const location = useLocation();
  const { searchResults, searchType, searchTerm } = location.state || {};
  const navigate = useNavigate();
  const [readingStatus, setReadingStatus] = useState({});
  
  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  const handleStatusChange = async (bookId, newStatus, bookTitle, authorId, authorName) => {
    setReadingStatus((prevStatus) => ({
      ...prevStatus,
      [bookId]: newStatus,
    }));

    const token = localStorage.getItem('jwtToken'); // Retrieve JWT from localStorage
    
    if (!token) {
      alert("You need to be logged in to update your reading status.");
      navigate('/login'); // Redirect to login page
      return;
    }

    // Decode the JWT to get the user information (e.g., username)
    const decodedToken = jwtDecode(token);
    const username = decodedToken.username; // Assuming username is part of the token payload

    try {
      const response = await axios.post(
        'http://localhost:8002/readinglist/updateStatus',
        {
          user_id: decodedToken.user_id, // Assuming the token contains user_id
          username: username,
          book_title: bookTitle,
          author_name: authorName,
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token in Authorization header
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        alert(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          alert('Session expired. Please log in again.');
          navigate('/login'); // Redirect to login
        } else if (error.response.status === 403) {
          alert('Access forbidden. Invalid token.');
        } else {
          alert(`Error: ${error.response.data.message || 'Something went wrong.'}`);
        }
      } else {
        console.error('Network or other error:', error);
        alert('There was an error processing your request.');
      }
    }
  };

  return (
    <div className="search-page">
      <div id="display-results">
        <h2>Search Results</h2>
        <p>Search Type: {searchType}</p>
        <p>Search Term: {searchTerm}</p>

        <div className="search-list">
          {searchResults && searchResults.length > 0 ? (
            searchResults.map((result, index) => (
              <div key={index} className="book-card">
                <img src={result.bookImageUrl} alt={result.title} className="book-cover" />
                <h3>{result.title}</h3>
                <p>Author: {result.author}</p>
                <p>Rating: {result.ratings} ⭐</p>

                {/* Dropdown for selecting reading status */}
                <div className="reading-list">
                  <label htmlFor={`reading-list-${index}`}>Add to Reading List:</label>
                  <select
                    id={`reading-list-${index}`}
                    value={readingStatus[result.id] || ''}
                    onChange={(event) =>
                      handleStatusChange(
                        result.id,
                        event.target.value,
                        result.title,
                        result.authorId,  // Assuming result contains authorId
                        result.author
                      )
                    }
                  >
                    <option value="">Select a list...</option>
                    <option value="Want to Read">Want To Read</option>
                    <option value="Currently Reading">Currently Reading</option>
                    <option value="Read">Read</option>
                  </select>
                </div>
              </div>
            ))
          ) : (
            <p>
              No books found matching your search criteria.{' '}
              <span
                onClick={handleBack}
                style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
              >
                Click here
              </span>{' '}
              to try again
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchResults;
