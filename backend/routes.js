const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { fetchBooks, fetchBooksFromOpenLibrary, insertBooksIntoDatabase } = require('./queries');
const connectToDatabase = require('./db');
const router = express.Router();

// Books route (if needed)
router.get('/books', async (req, res) => {
  const { title, author } = req.query;

  if (!title && !author) {
    return res.status(400).json({ error: 'Please provide either a title or an author name.' });
  }

  try {
    const searchTerm = title || author;
    console.log(`Searching for: ${searchTerm}`); // Log the search term
    const books = await fetchBooksFromOpenLibrary(searchTerm);
    console.log(`Fetched books: ${JSON.stringify(books)}`); // Log the fetched books

    // Insert fetched books into the database
    await insertBooksIntoDatabase(books);
    console.log('Books inserted into the database successfully.');

    res.json(books);
  } catch (err) {
    console.error('Error fetching or inserting books:', err);
    res.status(500).json({ error: 'Failed to fetch or insert books' });
  }
});
module.exports = router;
