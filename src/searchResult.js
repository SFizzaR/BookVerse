import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './components/section.css'; // Ensure this path is correct

function SearchResults() {
  const location = useLocation();
  const { searchResults, searchType, searchTerm } = location.state || {};
  const navigate = useNavigate(); 
  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div className="search-page">
      <div id="user-navbar">
        <h2 id="title">Book Verse</h2>
      </div>
      <div id='display-results'>
        <h2>Search Results</h2>
        <p>Search Type: {searchType}</p>
        <p>Search Term: {searchTerm}</p>

        <div className="book-list">
          {searchResults && searchResults.length > 0 ? (
            searchResults.map((result, index) => (
              <div key={index} className="book-card">
                <img src={result.bookImageUrl} alt={result.title} className="book-cover" />
                <h3>{result.title}</h3>
                <p>Author: {result.author}</p>
                <p>Rating: {result.ratings} ⭐</p>
              
              </div>
            ))
          ) : (
            <p>No books found matching your search criteria.
              <span 
                onClick={handleBack} 
                style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
                Click here
              </span> to try again
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchResults;
