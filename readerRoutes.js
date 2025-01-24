const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connectToDatabase = require('./db');
const router = express.Router();

router.get('/search-books', async (req, res) => {
    const { title = '', author = '', genre = '', minRating } = req.query;

    console.log('Search criteria:', { title, author, genre, minRating });

    const parsedMinRating = parseFloat(minRating);
    if (!title && !author && !genre && (isNaN(parsedMinRating) || parsedMinRating < 0)) {
        return res.status(400).send('Please provide at least one search criteria');
    }

    let connection;
    try {
        connection = await connectToDatabase();

        let query = `
            SELECT b.book_title, b.genre, a.author_name, b.ratings, b.book_image_url
            FROM books b 
            JOIN authors a ON b.author_id = a.author_id 
            WHERE 1=1`;

        const queryParams = {};

        if (title.trim()) {
            query += ` AND LOWER(b.book_title) LIKE LOWER(:title)`;
            queryParams.title = `%${title}%`;
        }
        if (author.trim()) {
            query += ` AND LOWER(a.author_name) LIKE LOWER(:author)`;
            queryParams.author = `%${author}%`;
        }
        if (genre.trim()) {
            query += ` AND LOWER(b.genre) LIKE LOWER(:genre)`;
            queryParams.genre = `%${genre}%`;
        }
        if (!isNaN(parsedMinRating) && parsedMinRating >= 0) {
            query += ` AND b.ratings = :minRating`;
            queryParams.minRating = parsedMinRating;
        }

        console.log('Search query:', query);
        console.log('Query parameters:', queryParams);

        const results = await connection.execute(query, queryParams);
        console.log('Search results:', results.rows);

        if (results.rows.length === 0) {
            return res.status(404).send('No books found with the given criteria');
        }

        // Transform rows into objects
        const books = results.rows.map(row => ({
            title: row[0],
            genre: row[1],
            author: row[2],
            ratings: row[3],
            bookImageUrl: row[4] // Assuming this is the URL field
        }));

        res.status(200).json({ totalBooks: books.length, books });
    } catch (err) {
        console.error('Error searching for books:', err);
        res.status(500).json({ error: 'Failed to fetch books' });
    }
});

router.get('/getreadinglist', async (req, res) => {
    console.log("Route hit");
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        console.error("Authorization header is missing");
        return res.status(401).json({ error: 'Authorization header is missing' });
    }

    const token = authHeader.split(' ')[1]; // Extract the JWT token

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const username = decoded.username; // Extract `username` from decoded token

        console.log('Decoded Token:', decoded);
        console.log('Username from token:', username);

        if (!username) {
            console.error("Username is missing in the token");
            return res.status(400).json({ error: 'Invalid token, username is missing' });
        }
        const connection = await connectToDatabase();


        const userIdResult = await connection.execute(
            'SELECT user_id FROM users WHERE username = :username',
            { username }
        );
        console.log('userIdResult:', userIdResult);
        if (userIdResult.rows.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const userId = userIdResult.rows[0][0]; // userIdResult.rows[0][0] contains the user_id
        console.log('Fetched userId:', userId);


        const query = `
            SELECT b.BOOK_IMAGE_URL, rl.STATUS
            FROM READINGLIST rl JOIN BOOKS b
            ON rl.BOOK_ID = b.BOOK_ID
            WHERE rl.user_id = :userId
        `;

        const result = await connection.execute(query, { userId });
        console.log('Rows from DB:', result.rows);

        if (result.rows.length === 0) {
            console.log("No books found for this username");
            return res.status(404).json({ message: 'No books found in the reading list' });
        }

        const groupedBooks = {
            currentlyReading: [],
            read: [],
            wantToRead: [],
        };

        result.rows.forEach((row) => {
            const BOOK_IMAGE_URL = row[0]; // First element is BOOK_IMAGE_URL
            const STATUS = row[1];         // Second element is STATUS
        
            const book = { image: BOOK_IMAGE_URL }; // Create book object with image URL only
        
            if (STATUS === 'Currently Reading') groupedBooks.currentlyReading.push(book);
            else if (STATUS === 'Read') groupedBooks.read.push(book);
            else if (STATUS === 'Want to Read') groupedBooks.wantToRead.push(book);
        });
        
        console.log('Grouped Books:', groupedBooks);

        return res.status(200).json(groupedBooks);
    } catch (error) {
        console.error('Error fetching reading list:', error);
        return res.status(500).json({ error: 'An error occurred while fetching the reading list' });
    }
});


// Logout route
router.post('/logout', async (req, res) => {
    try {
        const token = req.headers['authorization'].split(' ')[1]; // Get token from headers
        if (!token) {
            return res.status(400).json({ error: 'No token provided' });
        }

        // Decode the token and extract the username
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { username } = decoded;  // Extract username from decoded token
        console.log('Decoded Username:', username); // Log the username to verify

        if (!username) {
            return res.status(400).json({ error: 'Username not found in token' });
        }

        const connection = await connectToDatabase();

        // Retrieve user_id based on the username
        const userIdQuery = await connection.execute(
            'SELECT user_id FROM USERS WHERE username = :username',
            [username]
        );

        if (userIdQuery.rows.length === 0) {
            return res.status(400).json({ error: 'User not found' });
        }

        const userId = userIdQuery.rows[0][0]; // Extract the user_id

        // Update the logout time for the most recent session (where logout_time is NULL)
        const result = await connection.execute(`
            BEGIN
                log_user_activity(:user_id, 'LOGOUT');
            END;
        `, { user_id: userId });

        if (result.rowsAffected === 0) {
            return res.status(400).json({ error: 'No active session found for this user.' });
        }

        await connection.commit();

        return res.status(200).json({ message: 'Logout successful' });
    } catch (err) {
        console.error('Logout error:', err);
        return res.status(500).json({ error: 'Logout failed' });
    }
});


module.exports = router;
