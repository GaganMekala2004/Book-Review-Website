import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import pg from 'pg';

const app = express();
const port = 3000;

// Configure PostgreSQL connection
const db = new pg.Client({
  user: 'postgres',
  host: 'localhost',
  database: 'book',
  password: '', // Add your password here
  port: 5432,
});

db.connect().catch(err => console.error('Database connection error:', err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Display books on homepage
app.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM books');
    res.render('index', { books: result.rows });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.send('Failed to fetch books.');
  }
});

// Render Add Book form
app.get('/add', (req, res) => {
  res.render('add');
});

// Render Edit Book form
app.get('/edit/:isbn', async (req, res) => {
  const { isbn } = req.params;
  
  try {
    const result = await db.query('SELECT * FROM books WHERE isbn = $1', [isbn]);
    const book = result.rows[0];
    
    if (book) {
      res.render('edit', { book });
    } else {
      res.status(404).send('Book not found');
    }
  } catch (error) {
    console.error('Error fetching book for edit:', error);
    res.send('Failed to fetch book.');
  }
});

// Handle POST request to edit a book
app.post('/edit-book', async (req, res) => {
  const { title, author, review, rating, isbn } = req.body;
  
  try {
    const query = `
      UPDATE books
      SET title = $1, author = $2, review = $3, rating = $4
      WHERE isbn = $5
    `;
    await db.query(query, [title, author, review, rating, isbn]);
    res.redirect('/');
  } catch (error) {
    console.error('Error updating book:', error);
    res.send('Failed to update book.');
  }
});

// Handle POST request to add a book
app.post('/add-book', async (req, res) => {
  const { title, author, review, rating, isbn } = req.body;
  const coverUrl = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;

  try {
    await axios.get(coverUrl);

    const query = `
      INSERT INTO books (title, author, review, rating, isbn, cover)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
    await db.query(query, [title, author, review, rating, isbn, coverUrl]);

    res.redirect('/');
  } catch (error) {
    console.error('Error adding book:', error);
    res.send('Failed to add book.');
  }
});

// Handle POST request to delete a book by ISBN
app.post('/delete/:isbn', async (req, res) => {
  const { isbn } = req.params;

  try {
    await db.query('DELETE FROM books WHERE isbn = $1', [isbn]);
    res.redirect('/');
  } catch (error) {
    console.error('Error deleting book:', error);
    res.send('Failed to delete book.');
  }
});

// Handle GET request to search books
app.get('/search', async (req, res) => {
    const { query } = req.query;
  
    try {
      // Use ILIKE for case-insensitive search
      const result = await db.query(`
        SELECT * FROM books 
        WHERE title ILIKE $1 OR author ILIKE $1 OR isbn ILIKE $1
      `, [`%${query}%`]);
  
      res.render('index', { books: result.rows });
    } catch (error) {
      console.error('Error searching books:', error);
      res.send('Failed to search books.');
    }
  });

// Display books with optional sorting
app.get('/', async (req, res) => {
    const { sort } = req.query;
  
    let orderBy = 'title'; // Default sorting by title
    if (sort === 'author') {
      orderBy = 'author';
    } else if (sort === 'rating') {
      orderBy = 'rating';
    }
  
    try {
      const result = await db.query(`SELECT * FROM books ORDER BY ${orderBy}`);
      res.render('index', { books: result.rows });
    } catch (error) {
      console.error('Error fetching books:', error);
      res.send('Failed to fetch books.');
    }
  });
  
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
