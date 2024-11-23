const express = require('express');
const connectToDatabase = require('./db'); // Adjust the path as needed
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();
const axios = require('axios');

const getBadgeType = (readCount) => {
    if (readCount >= 100) return 'master';
    if (readCount >= 50) return 'expert';
    if (readCount >= 30) return 'gold';
    if (readCount >= 15) return 'silver';
    if (readCount >= 5) return 'beginner';
    return null; // No badge for less than 5 books read
};

function decodeToken(token) {
    try {
        console.log('Decoding Token:', token);  // Log the token to make sure it's being passed
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Token:', decoded);  // Log the decoded token
        return decoded;
    } catch (err) {
        console.error('JWT Verification Error:', err);
        throw new Error('Invalid or expired token');
    }
}

router.post('/updateStatus', async (req, res) => {
    let connection;

    try {
        console.log('JWT_SECRET (Verification):', process.env.JWT_SECRET);
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization header is missing' });
        }

        const token = authHeader.split(' ')[1];
        console.log("Received Token:", token);

        const decoded = decodeToken(token);
        console.log("Decoded Token:", decoded);

        const username = decoded.username;
        const { book_title, author_name, status } = req.body;

        connection = await connectToDatabase();

        // Fetch user_id using the username
        const userIdResult = await connection.execute(
            'SELECT user_id from users where username=:username',
            { username }
        );
        console.log('userIdResult:', userIdResult);
        if (userIdResult.rows.length === 0) {
            return res.status(404).json({ message: 'UserId not fetched. Ensure the username exists.' });
        }
        
        // Access the user_id from the first row and first column
        const userId = userIdResult.rows[0][0];  // userIdResult.rows[0] is an array, and we need the first value [0]
        
        console.log('Fetched userId:', userId);
        
        // Fetch book and author details
        // Fetch book and author details
const bookAndAuthorQuery = await connection.execute(
    `SELECT b.book_id, b.book_title, a.author_id, a.author_name
     FROM books b
     JOIN authors a ON b.author_id = a.author_id
     WHERE b.book_title = :book_title AND a.author_name = :author_name`,
    { book_title, author_name }
);

if (bookAndAuthorQuery.rows.length === 0) {
    return res.status(404).json({ message: 'Book or Author not found in the database' });
}

console.log('bookAndAuthorQuery:', bookAndAuthorQuery);

// Destructure the row to extract book_id and author_id
const [book_id, , author_id] = bookAndAuthorQuery.rows[0];
console.log('book_id:', book_id, 'author_id:', author_id);

// Check if the entry already exists in readinglist
const existingEntryQuery = await connection.execute(
    `SELECT * FROM readinglist WHERE user_id = :user_id AND book_id = :book_id`,
    { user_id: userId, book_id }
);

if (existingEntryQuery.rows.length > 0) {
    await connection.execute(
        `UPDATE readinglist SET status = :status WHERE user_id = :user_id AND book_id = :book_id`,
        { status, user_id: userId, book_id }
    );
    await connection.commit();
    return res.status(200).json({ message: 'Reading status updated successfully' });
} else {
    const username = decoded.username || (await connection.execute(
        `SELECT username FROM users WHERE user_id = :user_id`,
        { user_id: userId }
    )).rows[0]?.username;

    console.log('Inserting data into readinglist:', {
        user_id: userId,
        username,
        book_id,
        book_title,
        author_id,
        author_name,
        status
    });

    await connection.execute(
        `INSERT INTO readinglist (user_id, username, book_id, book_title, author_id, author_name, status)
         VALUES (:user_id, :username, :book_id, :book_title, :author_id, :author_name, :status)`,
        {
            user_id: userId,
            username,
            book_id,
            book_title,
            author_id,  // Ensure this is a valid string (VARCHAR2)
            author_name,
            status
        }
    );

    await connection.commit();

    console.log('userId; ',userId);

    const readResult = await connection.execute(
        `SELECT COUNT(user_id) AS read_count 
         FROM readinglist 
         WHERE user_id = :userId AND status = 'Read'`,
        { userId }
    );

    const readCount = readResult.rows[0][0]; // Get the count of 'read' books
    console.log('read count:', readCount);

    // Determine the badge based on the read count
    const newBadgeType = getBadgeType(readCount);
    console.log('new badge:',newBadgeType);

    // If a new badge type is determined, update the badge
    if (newBadgeType) {
        try {
            // Call the updateBadge route via an HTTP request
            const response = await axios.post(
                'http://localhost:8002/badges/updateBadge', // Adjust the URL to your server's URL
                {
                    userId,
                    newBadgeType,
                    username
                },
                {
                    headers: {
                        Authorization: req.headers.authorization,  // Pass authorization header if needed
                    }
                }
            );

            console.log('Badge update response:', response.data);
        } catch (error) {
            console.error('Error calling updateBadge route:', error);
            return res.status(500).json({ message: 'Error updating badge.' });
        }
    }

    // Continue with the normal flow for the update status route
    await connection.commit();

    return res.status(201).json({ message: 'Reading status added successfully' });
}

    } catch (error) {
        console.error('Error updating reading status:', error);
        res.status(500).json({ message: 'Server error' });
    } 
});

router.get('/getReadingStatuses', async (req, res) => {
    let connection;

    try {
        console.log('JWT_SECRET (Verification):', process.env.JWT_SECRET);
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization header is missing' });
        }

        const token = authHeader.split(' ')[1];
        console.log("Received Token:", token);

        const decoded = decodeToken(token);
        console.log("Decoded Token:", decoded);

        const username = decoded.username;

        connection = await connectToDatabase();

        // Fetch user_id using the username
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

        // Fetch reading statuses for all books for this user
        const readingStatusesQuery = await connection.execute(
            `SELECT 
                rl.book_id, 
                rl.status, 
                b.book_title, 
                a.author_name
             FROM readinglist rl
             JOIN books b ON rl.book_id = b.book_id
             JOIN authors a ON b.author_id = a.author_id
             WHERE rl.user_id = :user_id`,
            { user_id: userId }
        );

        console.log('Reading statuses fetched:', readingStatusesQuery.rows);

        if (readingStatusesQuery.rows.length === 0) {
            return res.status(404).json({ message: 'No reading statuses found for the user.' });
        }

        // Transform the result into an array of objects
        const readingStatuses = readingStatusesQuery.rows.map(([book_id, status, book_title, author_name]) => ({
            book_id,
            status,
            book_title,
            author_name,
        }));

        return res.status(200).json(readingStatuses);

    } catch (error) {
        console.error('Error fetching reading statuses:', error);
        res.status(500).json({ message: 'Server error while fetching reading statuses.' });
    } 
});



module.exports = router;
