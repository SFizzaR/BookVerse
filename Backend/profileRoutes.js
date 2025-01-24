const express = require('express');
const jwt = require('jsonwebtoken');
const connectToDatabase = require('./db');

const router = express.Router();

router.put('/profile', async (req, res) => {
    console.log('Profile update route hit');

    const { username, email, bio } = req.body; // New profile data
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header is missing' });
    }

    const token = authHeader.split(' ')[1]; // Extract the JWT token

    try {
        // Verify and decode the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const usernameFromToken = decoded.username; // Extract `username` from decoded token

        console.log('Decoded Token:', decoded);
        console.log('Username from token:', usernameFromToken);

        if (!usernameFromToken) {
            return res.status(400).json({ error: 'Invalid token, username is missing' });
        }

        // Connect to the database
        const connection = await connectToDatabase();

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

        console.log('User ID from database:', userId);

        // Update the user's profile in the database
        const result = await connection.execute(
            `UPDATE USERS 
             SET USERNAME = :username, EMAIL = :email, BIO = :bio 
             WHERE USER_ID = :userId`,
            { username, email, bio, userId }
        );

        await connection.commit();

        if (result.rowsAffected === 0) {
            return res.status(404).json({ error: 'No changes made to the profile' });
        }

        console.log(`User profile updated for ID: ${userId}`);
        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            console.error('Invalid token:', error);
            return res.status(401).json({ error: 'Invalid token' });
        } else if (error.name === 'TokenExpiredError') {
            console.error('Expired token:', error);
            return res.status(401).json({ error: 'Token has expired' });
        }

        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'An error occurred. Please try again.' });
    }
});

module.exports = router;
