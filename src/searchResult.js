import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Correct import
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import the styles for toast notifications
import './search.css';

function SearchResults() {
  const location = useLocation();
  const { searchResults, searchType, searchTerm } = location.state || {};
  const navigate = useNavigate();

  const [groupedBooks, setGroupedBooks] = useState({
    currentlyReading: [],
    read: [],
    wantToRead: [],
  });

  useEffect(() => {
    const fetchReadingList = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const decoded = jwtDecode(token);
        const response = await axios.get('http://localhost:8002/readinglist/getReadingStatuses', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const grouped = response.data.reduce(
          (acc, book) => {
            const { status, image, id } = book;
            if (status === 'Currently Reading') acc.currentlyReading.push({ id, image });
            else if (status === 'Read') acc.read.push({ id, image });
            else if (status === 'Want to Read') acc.wantToRead.push({ id, image });
            return acc;
          },
          { currentlyReading: [], read: [], wantToRead: [] }
        );

        setGroupedBooks(grouped);
      } catch (error) {
        console.error('Error fetching reading list:', error);
        toast.error('Failed to load your reading list.');
      }
    };

    fetchReadingList();
  }, []);

  const handleStatusChange = async (bookId, newStatus, bookTitle, authorId, authorName) => {
    try {
      const token = localStorage.getItem('jwtToken');
      const decoded = jwtDecode(token);

      if (!token) {
        toast.error('You need to be logged in to update your reading status.');
        navigate('/#');
        return;
      }

      await axios.post(
        'http://localhost:8002/readinglist/updateStatus',
        {
          user_id: decoded.user_id,
          username: decoded.username,
          book_title: bookTitle,
          author_name: authorName,
          status: newStatus,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setGroupedBooks((prev) => {
        const updated = {
          currentlyReading: prev.currentlyReading.filter((b) => b.id !== bookId),
          read: prev.read.filter((b) => b.id !== bookId),
          wantToRead: prev.wantToRead.filter((b) => b.id !== bookId),
        };

        if (newStatus === 'Currently Reading') updated.currentlyReading.push({ id: bookId, image: bookTitle });
        else if (newStatus === 'Read') updated.read.push({ id: bookId, image: bookTitle });
        else if (newStatus === 'Want to Read') updated.wantToRead.push({ id: bookId, image: bookTitle });

        return updated;
      });

      toast.success('Your reading status has been updated.');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update the reading status.');
    }
  };

  return (
    <div className="search-page">
      <ToastContainer /> {/* Include the ToastContainer in your JSX to show toasts */}
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

                <div className="reading-list">
                  <label htmlFor={`reading-list-${index}`}>Add to Reading List:</label>
                  <select
                    id={`reading-list-${index}`}
                    onChange={(event) =>
                      handleStatusChange(
                        result.id,
                        event.target.value,
                        result.title,
                        result.authorId,
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
            <p>No books found matching your search criteria.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchResults;
