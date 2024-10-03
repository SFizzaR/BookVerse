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

module.exports=router;