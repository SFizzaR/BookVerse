const express = require('express');
const router = express.Router();

// Logout route
router.post('/logout', async (req, res) => {
    try {
        // Invalidate the JWT token by clearing the client-side cookie/token
        // You can add token blacklisting logic here if needed (optional)

        res.clearCookie('token');  // If you're storing the JWT in cookies
        return res.status(200).json({ message: 'Logout successful' });
    } catch (err) {
        console.error('Logout error:', err);
        return res.status(500).json({ error: 'Logout failed' });
    }
});

module.exports = router;
