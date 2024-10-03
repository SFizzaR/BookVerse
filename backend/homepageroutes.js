const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connectToDatabase = require('./db');
const router = express.Router();

// Signup route
router.post('/signup', async (req, res) => {
    const { username, email, password, role } = req.body;
    try {
      const connection = await connectToDatabase();
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Insert user into the Users table
      await connection.execute(
        `INSERT INTO Users (username, email, password, role) VALUES (:username, :email, :password, :role)`,
        { username, email, password: hashedPassword, role }
      );
  
      await connection.commit();
      res.status(201).send('User registered successfully');
    } catch (err) {
      console.error('Error registering user:', err);
      res.status(500).send('Error registering user');
    }
  });
  
  // Login route
  router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    let connection;
  
    try {
      connection = await connectToDatabase();
  
      // Execute SQL query to find the user by username
      const result = await connection.execute(
        `SELECT * FROM USERS WHERE USERNAME = :username`,
        [username]
      );
  
      // Check if user exists
      if (result.rows.length === 0) {
        return res.status(400).json({ error: 'User not found' });
      }
  
      // Assuming your user data is in the first row
      const user = result.rows[0];
  
      // Access the hashed password correctly
      const hashedPassword = user[3]; // Get the hashed password
  
      // Compare passwords
      const isPasswordValid = await bcrypt.compare(password, hashedPassword);
  
      if (!isPasswordValid) {
        return res.status(400).json({ error: 'Invalid password' });
      }
  
      // Create JWT token using user_id
      const token = jwt.sign({ id: user.user_id, role: user.ROLE }, 'your_jwt_secret', { expiresIn: '1h' });
  
      // Send success response
      res.status(200).json({ message: 'Login successful', token, role: user.ROLE });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ error: 'An error occurred. Please try again.' });
    } finally {
      // Close the database connection if it exists
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error('Error closing connection', err);
        }
      }
    }
  });
  // Searching for books
router.get('/search-books', async (req, res) => {
    const { title = '', author = '', genre = '', minRating = 0 } = req.query;
  
    // Check if any meaningful criteria is provided (non-empty and valid)
    if (!title && !author && !genre && minRating <= 0) {
      return res.status(400).send('Please provide at least one search criteria');
    }
  
    let connection;
    try {
      connection = await connectToDatabase();
      
      let query = `
        SELECT b.book_title, b.genre, a.author_name, b.ratings 
        FROM books b 
        JOIN authors a ON b.author_id = a.author_id 
        WHERE 1=1`;
  
      const queryParams = {};
  
      // Only append conditions if parameters are non-empty and valid
      if (title.trim()) { // Check if title is not an empty string
        query += ` AND b.book_title LIKE :title`;
        queryParams.title = `%${title}%`;
      }
      if (author.trim()) { // Check if author is not an empty string
        query += ` AND LOWER(a.author_name) LIKE LOWER(:author)`; // Case-insensitive search
        queryParams.author = `%${author}%`;
      }
      if (genre.trim()) { // Check if genre is not an empty string
        query += ` AND b.genre LIKE :genre`;
        queryParams.genre = `%${genre}%`;
      }
      if (minRating > 0) { // Ensure minRating is greater than 0
        query += ` AND b.ratings >= :minRating`;
        queryParams.minRating = parseFloat(minRating);
      }
  
      console.log('Query:', query);
      console.log('Parameters:', queryParams);
  
      const results = await connection.execute(query, queryParams);
  
      console.log('Results:', results); // Log the results
  
      if (results.rows.length === 0) {
        return res.status(404).send('No books found with the given criteria');
      }
      res.status(200).json({ totalBooks: results.rows.length, books: results.rows });
    } catch (err) {
      console.error('Error searching for books:', err);
      res.status(500).json({ error: 'Failed to fetch books' });
    }
  });
  
  module.exports = router;
