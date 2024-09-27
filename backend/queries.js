const axios = require('axios');
const oracledb = require('oracledb');
const connectToDatabase = require('./db');

async function fetchBooks() {
    let connection;
    try {
        connection = await connectToDatabase();
        const result = await connection.execute(
            `SELECT * FROM books`, // Query to fetch all books
            [], // Bind variables acting as placeholders
            { outFormat: oracledb.OUT_FORMAT_OBJECT } // Output format
        );
        return result.rows;
    } catch (err) {
        console.error('Error fetching data from database:', err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error closing connection:', err);
            }
        }
    }
}

async function fetchBooksFromOpenLibrary(searchTerm) {
    try {
        const response = await axios.get(`https://openlibrary.org/search.json?q=${searchTerm}`);
        return response.data.docs; // Returns an array of books
    } catch (error) {
        console.error('Error fetching books from Open Library:', error);
        throw error;
    }
}

async function insertBooksIntoDatabase(books) {
    console.log(`Attempting to insert ${books.length} books into database...`);
    let connection;
    try {
        connection = await connectToDatabase();

        for (let book of books) {
            console.log(`Inserting book: ${book.title || 'Unknown Title'}`);

            // Prepare the fields
            const bookTitle = book.title || 'Unknown Title';
            const authorName = Array.isArray(book.author_name) ? book.author_name.join(', ') : 'Unknown Author';
            const genre = Array.isArray(book.subject) ? book.subject.slice(0, 3).join(', ') : 'Unknown Genre';
            const authorId = Array.isArray(book.author_key) ? book.author_key.join(', ') : 'Unknown Author ID';

            // Format publish date and handle unknown dates
            const rawPublishDate = Array.isArray(book.publish_date) ? book.publish_date[0] : 'Unknown';
            const publishDate = rawPublishDate !== 'Unknown' ? formatDate(rawPublishDate) : null; // Use null for unknown

            const ratings = book.ratings_average ? parseFloat(book.ratings_average).toFixed(1) : null; // Format ratings to 1 decimal

            // Log the details being inserted
            console.log(`Inserting details - Title: ${bookTitle}, Author: ${authorName}, Genre: ${genre}, Author ID: ${authorId}, Publish Date: ${publishDate}, Ratings: ${ratings}`);

            // Execute the insert
            await connection.execute(
                `INSERT INTO Books(book_title, author_name, genre, author_id, publish_date, ratings) VALUES (:book_title, :author_name, :genre, :author_id, :publish_date, :ratings)`,
                { 
                    book_title: bookTitle, 
                    author_name: authorName,
                    genre: genre,
                    author_id: authorId,
                    publish_date: publishDate,
                    ratings: ratings,
                }
            );
        }

        await connection.commit();
        console.log('All books inserted successfully!');
    } catch (err) {
        console.error('Error inserting books into database:', err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
                console.log('Database connection closed.');
            } catch (err) {
                console.error('Error closing connection:', err);
            }
        }
    }
}

// Function to format the date to 'DD-MMM-YYYY'
function formatDate(dateString) {
    // Remove ordinal suffixes (st, nd, rd, th) from the date string
    const cleanedDateString = dateString.replace(/(\d+)(st|nd|rd|th)/, '$1');

    const parsedDate = new Date(cleanedDateString);
    
    // Check if the date is valid
    if (isNaN(parsedDate.getTime())) {
        console.error(`Invalid date format: ${cleanedDateString}`);
        return null; // Return null if date is invalid
    }

    const day = parsedDate.getDate().toString().padStart(2, '0'); // Get day and pad to 2 digits
    const month = parsedDate.toLocaleString('default', { month: 'short' }).toLowerCase(); // Get short month name in lowercase
    const year = parsedDate.getFullYear(); // Get the full year

    return `${day}-${month}-${year}`; // Return formatted date
}



/*async function fetchBooksFromOpenLibrary(searchTerm) {
    try {
        const response = await axios.get(`https://openlibrary.org/search.json?q=${searchTerm}`);
        return response.data.docs; // Returns an array of books
    } catch (error) {
        console.error('Error fetching books from Open Library:', error);
        throw error;
    }
}

async function insertBooksIntoDatabase(books) {
    let connection;
    try {
        console.log(`Starting to insert ${books.length} books...`);
        
        // Open the database connection
        connection = await connectToDatabase();
        if (!connection) {
            throw new Error('Failed to connect to the database');
        }
        
        console.log(`Connected to database. Inserting books...`);

        // Filter out duplicate books based on title and author
        const uniqueBooks = [];
        const uniqueKeys = new Set();

        books.forEach(book => {
            const title = book.title || 'Unknown Title';
            const authors = Array.isArray(book.author_facet) ? book.author_facet.join(', ') : 'Unknown Author';
            const key = `${title}-${authors}`;
            if (!uniqueKeys.has(key)) {
                uniqueKeys.add(key);
                uniqueBooks.push(book);
            }
        });

        console.log(`Filtered down to ${uniqueBooks.length} unique books.`);

        for (let book of uniqueBooks) {
            console.log(`Processing book: ${book.title}`);

            // Extract author ID from the author_facet
            const authorId = Array.isArray(book.author_facet) ? book.author_facet[0] : 'Unknown Author Key';

            // Handle the subject field for genres
            let genres = 'Unknown Genre';
            if (Array.isArray(book.subject) && book.subject.length > 0) {
                genres = book.subject.slice(0, 4).join(', '); // Extract up to 4 subjects
                console.log(`Extracted genres from array: ${genres}`);
            } else if (typeof book.subject === 'string') {
                genres = book.subject; // Handle as a single string
                console.log(`Extracted genres from string: ${genres}`);
            } else {
                console.log(`No valid subject found for book: ${book.title}`);
            }

            // Extract ratings
            const ratingsAverage = book.ratings_average || null; // Default to null if not available
            // Check if the book already exists
            const existingBook = await connection.execute(
                `SELECT COUNT(*) AS count FROM Books WHERE book_title = :book_title AND author_name = :author_name`,
                {
                    book_title: book.title || 'Unknown Title',
                    author_name: authorId
                }
            );

            if (existingBook.rows[0].COUNT > 0) {
                console.log(`Book "${book.title}" by ${authorId} already exists. Skipping insert.`);
                continue; // Skip to the next book
            }

            console.log(`Inserting book: ${book.title}, Author: ${authorId}, Genres: ${genres}, Ratings: ${ratingsAverage}`);

            // You may need to set a default or leave as NULL if publish date is unavailable
            const publishDate = null; // Placeholder; adjust according to your data

            // Insert the new book
            const result = await connection.execute(
                `INSERT INTO Books(book_title, author_name, genre, author_id, publish_date, ratings) VALUES (:book_title, :author_name, :genre, :author_id, :publish_date, :ratings)`,
                {
                    book_title: book.title || 'Unknown Title',
                    author_name: authorId,
                    genre: genres,
                    author_id: authorId, // You may want to map this to an actual author ID in your database
                    publish_date: publishDate,
                    ratings: ratingsAverage,
                }
            );

            console.log(`Insert result for book "${book.title}": ${JSON.stringify(result)}`);
        }

        // Commit the transaction
        console.log('Attempting to commit changes...');
        await connection.commit();
        console.log('All books inserted successfully!');
    } catch (err) {
        console.error('Error inserting books into database:', err);
    } finally {
        // Ensure connection is closed
        if (connection) {
            try {
                await connection.close();
                console.log('Database connection closed.');
            } catch (err) {
                console.error('Error closing connection:', err);
            }
        }
    }
}
*/

module.exports = {
    fetchBooks,
    fetchBooksFromOpenLibrary,
    insertBooksIntoDatabase,
};
