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
      const token = jwt.sign({ id: user.user_id, role: user.ROLE}, 'your_jwt_secret', { expiresIn: '1h' });
  
      // Send success response
      res.status(200).json({ message: 'Login successful', token, role: user.ROLE});
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

// Middleware to authenticate user
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    if (!token) return res.sendStatus(401); // Unauthorized

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).send('Invalid token');
        req.user = user; // Attach user info to request
        next();
    });
};

// Retrieve profile details
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const connection = await connectToDatabase();
        
        // Retrieve user data
        const result = await connection.execute(
            `SELECT * FROM Users WHERE user_id = :user_id`,
            { user_id: req.user.id }  // User ID from token
        );

        console.log('Rows returned from database:', result.rows);  // Log the fetched data

        if (result.rows.length === 0) {
            return res.status(400).send('User not found');
        }

        // Access the data by index
        const user = result.rows[0];
        const userId = user[0];   // Assuming user_id is at index 0
        const username = user[1]; // Assuming username is at index 1
        const email = user[2];    // Assuming email is at index 2
        const role = user[4];     // Assuming role is at index 4

        // Send the user profile in the response
        res.status(200).json({ userId, username, email, role });
    } catch (err) {
        console.error('Error retrieving profile:', err);
        res.status(500).send('Error retrieving profile');
    }
});


// Updating user profile
router.put('/profile', authenticateToken, async (req, res) => {
    const userId = req.user.id; // Get user ID from JWT token

    const { username, email } = req.body; // Get updated user data from request body

    try {
        const connection = await connectToDatabase();

        // Update user profile in database
        await connection.execute(
            `UPDATE Users SET username = :username, email = :email WHERE user_id = :userId`,
            { username, email, userId }
        );
        await connection.commit();
        console.log(`Profile updated for user ID: ${userId}, New username: ${username}, New email: ${email}`);

        res.status(200).send('Profile Updated Successfully');
    } catch (err) {
        console.error('Error updating profile:', err);
        res.status(500).send('Error updating profile');
    }
});


module.exports = router;
