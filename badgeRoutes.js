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

router.post('/updateBadge', async (req, res) => {
    try {
        const { userId, newBadgeType, username } = req.body;

        console.log('Route hit for updating badge');
        console.log(`Payload: userId=${userId}, newBadgeType=${newBadgeType}, username=${username}`);

        const connection = await connectToDatabase();

        // Check the user's current badge
        const currentBadgeResult = await connection.execute(
            `SELECT badge_id FROM users WHERE user_id = :userId`,
            { userId }
        );

        // Handle case where user has no badge assigned
        const currentBadgeId = currentBadgeResult.rows.length > 0 ? currentBadgeResult.rows[0][0] : null;

        if (currentBadgeId === null) {
            console.log(`User ${userId} is new and has no badge assigned.`);
        } else {
            console.log(`Current badge ID for userId ${userId}: ${currentBadgeId}`);
        }

        // Fetch the badge ID for the new badge type
        const newBadgeResult = await connection.execute(
            'SELECT badge_id FROM badges WHERE LOWER(badge_name) = LOWER(:newBadgeType)',
            { newBadgeType }
        );

        if (newBadgeResult.rows.length === 0) {
            return res.status(400).json({ message: 'Badge not found.' });
        }

        const newBadgeId = newBadgeResult.rows[0][0];
        console.log(`New badge ID for badgeType ${newBadgeType}: ${newBadgeId}`);

        // Update the user's badge (new assignment if null or an upgrade)
        await connection.execute(
            `UPDATE users SET badge_id = :newBadgeId WHERE user_id = :userId`,
            { newBadgeId, userId }
        );

        const badgeHistoryCheck = await connection.execute(
            `SELECT * FROM badgeHistory WHERE user_id = :userId AND badge_id = :newBadgeId`,
            { userId, newBadgeId }
        );

        // If no entry exists, insert the new badge into badgeHistory
        if (badgeHistoryCheck.rows.length === 0) {
            console.log(`Inserting new badge history entry for User ID ${userId}: ${newBadgeType}`);

            // Insert into badgeHistory table
            await connection.execute(`
                BEGIN
                    insert_badge_history(:userId, :newBadgeId);
                END;
            `, { userId, newBadgeId });
        } else {
            console.log(`Badge history already exists for User ID ${userId}: ${newBadgeType}`);
        }

        await connection.commit();

        console.log(`Badge ${newBadgeType} assigned to user ${userId}.`);
        return res.status(200).json({ message: 'Badge updated successfully.' });
    } catch (error) {
        if (connection) await connection.rollback();  // Rollback in case of error
        console.error('Error updating badge:', error);
        res.status(500).json({ message: 'Error updating badge', error: error.message });
    }
});

router.get('/assign-badges-to-past-users', async (req, res) => {
    try {
        const connection = await connectToDatabase();

        // Fetch all users and their current badge_id
        const usersResult = await connection.execute('SELECT user_id, badge_id FROM users');
        const users = usersResult.rows;

        for (let user of users) {
            const userId = user[0]; // User ID
            const currentBadgeId = user[1]; // Current badge_id of the user
            console.log(`User ID: ${userId}`);
            console.log(`Current Badge ID: ${currentBadgeId}`);

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

            // Fetch the badge_id for the new badge type (case-insensitive)
            const newBadgeResult = await connection.execute(
                `SELECT badge_id FROM badges WHERE LOWER(badge_name) = LOWER(:newBadgeType)`,
                { newBadgeType }
            );

            if (newBadgeResult.rows.length === 0) {
                console.log(`Badge not found for ${newBadgeType}. Skipping user ${userId}.`);
                continue; // Skip if the badge is not found
            }

            const newBadgeId = newBadgeResult.rows[0][0]; // Get the badge_id

            // Check if the new badge is higher than the current badge
            const isNewBadgeHigher = currentBadgeId === null || newBadgeId > currentBadgeId;

            if (isNewBadgeHigher) {
                console.log(`Updating badge for User ID ${userId}: ${newBadgeType}`);

                // Update the badge_id in the users table
                await connection.execute(
                    `UPDATE users 
                     SET badge_id = :newBadgeId 
                     WHERE user_id = :userId`,
                    { newBadgeId, userId }
                );

                // Fetch the username for inserting into badgeHistory
                const usernameResult = await connection.execute(
                    'SELECT username FROM users WHERE user_id = :userId',
                    { userId }
                );
                const username = usernameResult.rows[0][0]; // Extract the username
                console.log(`Username for User ID ${userId}: ${username}`);

                // Add the new badge to the badge history table
                await connection.execute(
                    `INSERT INTO badgeHistory (user_id, badge_id, earned_date) 
                     VALUES (:userId, :newBadgeId, SYSDATE)`,
                    { userId, newBadgeId }
                );
                console.log("ADDED");
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

//router.use("/assets", express.static(path.join(__dirname, "public/assets")));

function decodeToken(token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        throw new Error('Invalid or expired token');
    }
}

// Route to fetch badge details
router.get('/fetchUserBadge', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization header is missing' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = decodeToken(token);
        const username = decoded.username;

        const connection = await connectToDatabase();

        // Fetch user_id from the database
        const userResult = await connection.execute(
            'SELECT user_id FROM users WHERE username = :username',
            { username }
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const userId = userResult.rows[0][0]; // Extract user_id

        // Fetch badge details for the user
        const badgeResult = await connection.execute(
            `
            SELECT b.badge_name, b.badge_icon
            FROM badges b
            JOIN users u ON b.badge_id = u.badge_id
            WHERE u.user_id = :userId
            `,
            { userId }
        );

        if (badgeResult.rows.length === 0) {
            return res.status(404).json({ message: 'Badge not found for user.' });
        }

        const badge = badgeResult.rows[0]; // Extract badge data
        res.status(200).json({
            badge_name: badge[0], // Badge name
            badge_icon: badge[1], // Badge image filename
        });
    } catch (error) {
        console.error('Error fetching badge:', error);
        res.status(500).json({ message: 'Failed to fetch badge.' });
    }
});
  
module.exports = router;
