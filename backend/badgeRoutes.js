const express = require('express');
const jwt = require('jsonwebtoken');
const connectToDatabase = require('./db');
const router = express.Router();

// Helper function to determine badge type based on read count
const getBadgeType = (readCount) => {
    if (readCount >= 100) return 'master';
    if (readCount >= 50) return 'expert';
    if (readCount >= 30) return 'gold';
    if (readCount >= 15) return 'silver';
    if (readCount >= 5) return 'beginner';
    return null; // No badge for less than 5 books read
};


// Route to update the current badge for the logged-in user
/*router.get('/update-badge', async (req, res) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header is missing' });
    }

    const token = authHeader.split(' ')[1]; // Extract the JWT token

    try {
        // Verify the token and extract username
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const username = decoded.username;
        if (!username) {
            return res.status(400).json({ error: 'Invalid token, username is missing' });
        }

        // Connect to the database
        const connection = await connectToDatabase();

        // Fetch user_id and current badge for the logged-in user
        const userResult = await connection.execute(
            'SELECT user_id, badges FROM users WHERE username = :username',
            { username }
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'User not found in the database.' });
        }

        const userId = userResult.rows[0][0]; // Get user_id
        const currentBadge = userResult.rows[0][1]; // Get current badge

        // Count the number of 'read' books for the user
        const readResult = await connection.execute(
            `SELECT COUNT(*) AS read_count 
             FROM readinglist 
             WHERE user_id = :userId AND status = 'read'`,
            { userId }
        );

        const readCount = readResult.rows[0][0]; // Get the count of 'read' books

        // Determine the badge based on the read count
        const newBadgeType = getBadgeType(readCount);

        if (!newBadgeType) {
            return res.status(200).json({ message: 'User has not earned any badge yet.', readCount });
        }

        // Check if the new badge is higher than the current badge
        const badgeOrder = ['beginner', 'silver', 'gold', 'expert', 'master'];
        const isNewBadgeHigher =
            currentBadge === null || badgeOrder.indexOf(newBadgeType) > badgeOrder.indexOf(currentBadge);

        if (isNewBadgeHigher) {
            // Update the badges column in the users table
            await connection.execute(
                `UPDATE users 
                 SET badges = :newBadgeType 
                 WHERE user_id = :userId`,
                { newBadgeType, userId }
            );

            // Add the new badge to the badges history table
            await connection.execute(
                `INSERT INTO badges_history (user_id, badge_type, awarded_at) 
                 VALUES (:userId, :newBadgeType, SYSDATE)`,
                { userId, newBadgeType }
            );
        }

        // Commit the changes
        await connection.commit();

        // Fetch the badge details for the response
        const badgeResult = await connection.execute(
            `SELECT * FROM badges WHERE badge_type = :newBadgeType`,
            { newBadgeType }
        );

        const badge = badgeResult.rows[0];

        res.json({
            message: 'Badge updated successfully!',
            badge,
            readCount
        });

    } catch (err) {
        console.error('Error updating badge:', err);
        res.status(500).json({ message: 'Error updating badge', error: err.message });
    }
});*/

router.post('/updateBadge', async (req, res) => {
    let connection;
    console.log('route hit for update badge');

    try {
        const { userId, newBadgeType, username } = req.body;

        connection = await connectToDatabase();

        // Check if the new badge is higher than the current badge
        const badgeOrder = ['beginner', 'silver', 'gold', 'expert', 'master'];
        const currentBadgeResult = await connection.execute(
            `SELECT badges FROM users WHERE user_id = :userId`,
            { userId }
        );
        const currentBadge = currentBadgeResult.rows[0]?.[0];  // Get the current badge

        const isNewBadgeHigher = currentBadge === null || badgeOrder.indexOf(newBadgeType) > badgeOrder.indexOf(currentBadge);

        if (isNewBadgeHigher) {
            console.log('Updating badge in users table...');
            // Update the badges column in the users table
            await connection.execute(
                `UPDATE users SET badges = :newBadgeType WHERE user_id = :userId`,
                { newBadgeType, userId }
            );

            console.log('Inserting new badge into badges history...');
            // Insert the new badge into badges history
            await connection.execute(
                `INSERT INTO badgeHistory (user_id, badge_name, earned_date,username) 
                 VALUES (:userId, :newBadgeType, SYSDATE, :username)`,
                { userId, newBadgeType, username }
            );
            console.log('Badge history updated successfully');
        }

        await connection.commit();
        return res.status(200).json({ message: 'Badge updated successfully' });

    } catch (error) {
        console.error('Error updating badge:', error);
        res.status(500).json({ message: 'Error updating badge' });
    }
});


// Route to assign badges to all past users
router.get('/assign-badges-to-past-users', async (req, res) => {
    try {
        const connection = await connectToDatabase();

        // Fetch all users and their current badges
        const usersResult = await connection.execute('SELECT user_id, badges FROM users');
        const users = usersResult.rows;

        for (let user of users) {
            const userId = user[0]; // User ID
            const currentBadge = user[1]; // Current badge of the user
            console.log(`User ID: ${userId}`);
            console.log(`Current Badge: ${currentBadge}`);

            // Count the number of 'read' books for the user
            const readResult = await connection.execute(
                `SELECT COUNT(*) AS read_count 
                 FROM readinglist 
                 WHERE user_id = :userId AND status = 'Read'`,
                { userId }
            );

            const readCount = readResult.rows[0][0]; // Get the count of 'read' books
            console.log(`User ID: ${userId}, Read Count: ${readCount}`);

            // Determine the badge based on the read count
            const newBadgeType = getBadgeType(readCount);
            console.log(`New Badge Type for User ID ${userId}: ${newBadgeType}`);

            if (!newBadgeType) continue; // Skip if no badge is applicable

            // Check if the new badge is higher than the current badge
            const badgeOrder = ['beginner', 'silver', 'gold', 'expert', 'master'];
            const isNewBadgeHigher =
                currentBadge === null || badgeOrder.indexOf(newBadgeType) > badgeOrder.indexOf(currentBadge);

            if (isNewBadgeHigher) {
                console.log(`Updating badge for User ID ${userId}: ${newBadgeType}`);

                // Update the badges column in the users table
                await connection.execute(
                    `UPDATE users 
                     SET badges = :newBadgeType 
                     WHERE user_id = :userId`,
                    { newBadgeType, userId }
                );

                const usernameResult = await connection.execute(
                    'SELECT username FROM users WHERE user_id = :userId',
                    { userId }
                );
                const username = usernameResult.rows[0][0]; // Extract the username
                console.log(`Username for User ID ${userId}: ${username}`);


                // Add the new badge to the badge history table
                await connection.execute(
                    `INSERT INTO badgeHistory (user_id, badge_name, earned_date,username) 
                     VALUES (:userId, :newBadgeType, SYSDATE, :username)`,
                    { userId, newBadgeType, username }
                );
            }
        }

        // Commit the changes
        await connection.commit();

        res.json({ message: 'Badges assigned to all past users successfully.' });
    } catch (err) {
        console.error('Error assigning badges to past users:', err);
        res.status(500).json({ message: 'Error assigning badges', error: err.message });
    }
});

module.exports = router;
