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
        const hashedPassword = await bcrypt.hash(password, 10);

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
    const { email, password } = req.body;

    try {
        const connection = await connectToDatabase();

        const result = await connection.execute(
            `SELECT * FROM Users WHERE email = :email`,
            { email }
        );

        if (result.rows.length === 0) {
            return res.status(400).send('User not found');
        }

        const user = result.rows[0];
        const match = await bcrypt.compare(password, user[2]);

        if (!match) {
            return res.status(400).send('Invalid credentials');
        }

        const token = jwt.sign({ id: user[0], role: user[3] }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).send('Error logging in');
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
    const userId = req.user.id; // Get user ID from JWT token

    try {
        const connection = await connectToDatabase();

        // Retrieve user data
        const result = await connection.execute(
            `SELECT * FROM Users WHERE user_id = :userId`,
            { userId }
        );
        console.log('Rows returned from database:', result.rows);

        if (result.rows.length === 0) {
            return res.status(400).send('User not found');
        }

        // Destructure the user profile data
        const { USER_ID, USERNAME, EMAIL, PASSWORD, ROLE } = result.rows[0];
        res.status(200).json({ userId: USER_ID, username: USERNAME, email: EMAIL, role: ROLE });
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
