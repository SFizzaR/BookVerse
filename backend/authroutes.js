const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connectToDatabase = require('./db');
const router = express.Router();

//author adding books
router.post('/add-book',async(req,res)=>{
    const {title,genre,author,author_id,publish_date}=req.body;

    if(!title || !author_id ||!genre || !publish_date  || !author){
        return res.status(400).send('All fields required');
    }

    try{
        const connection=await connectToDatabase();

        await connection.execute(
            `INSERT INTO BOOKS(book_title,genre,author_name,author_id,publish_date) VALUES (:title,:genre,:author, :author_id,:publish_date)`,
            {title,genre,author,author_id,publish_date}
        );
        await connection.commit();
        res.status(201).send('Book added successfully');
    } catch(err){
        console.error('Error adding books',err);
        res.status(500).send('Error adding books');
    }
});

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


// Deleting books
router.delete('/delete-book/:id', async (req, res) => {
    const book_id = parseInt(req.params.id, 10);
    try {
        const connection = await connectToDatabase();

        const results = await connection.execute(
            `DELETE FROM BOOKS WHERE book_id = :book_id`,
            { book_id }
        );
        await connection.commit();

        if (results.rowsAffected === 0) {
            return res.status(404).send('Book not found');
        }

        res.status(200).send('Book deleted successfully');
    } catch (err) {
        console.error('Error deleting book', err);
        res.status(500).send('Error deleting book');
    }
});

// Logout route
router.post('/logout', async (req, res) => {
    try {
        // Invalidate the JWT token by clearing the client-side cookie/token
        // You can add token blacklisting logic here if needed (optional)

        //res.clearCookie('token');  // If you're storing the JWT in cookies
        return res.status(200).json({ message: 'Logout successful' });
    } catch (err) {
        console.error('Logout error:', err);
        return res.status(500).json({ error: 'Logout failed' });
    }
});

module.exports=router;
