const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

// Define Book class representing a book in a library
class Book {
  constructor(title, author, ISBN) {
    this.title = title;
    this.author = author;
    this.ISBN = ISBN;
  }

  // Method to display book information
  displayInfo() {
    return `Title: ${this.title}, Author: ${this.author}, ISBN: ${this.ISBN}`;
  }
}

// Define Library class representing a library
class Library {
  constructor() {
    this.books = [];
  }

  // Method to add a book to the library
  addBook(book) {
    this.books.push(book);
  }

  // Method to display all books in the library
  displayBooks() {
    return this.books.map(book => book.displayInfo());
  }

  // Method to search for a book by title
  searchByTitle(title) {
    const foundBooks = this.books.filter(book => book.title.toLowerCase().includes(title.toLowerCase()));
    return foundBooks.map(book => book.displayInfo());
  }
}

// Define EBook subclass that inherits from Book
class EBook extends Book {
  constructor(title, author, ISBN, fileFormat) {
    super(title, author, ISBN);
    this.fileFormat = fileFormat;
  }

  // Override displayInfo method to include file format
  displayInfo() {
    return `${super.displayInfo()}, File Format: ${this.fileFormat}`;
  }
}

// Create instances and test functionality
const book1 = new Book('The Catcher in the Rye', 'J.D. Salinger', '978-0-316-76948-0');
const ebook1 = new EBook('The Great Gatsby', 'F. Scott Fitzgerald', '978-0-7432-7356-5', 'PDF');

const library = new Library();
library.addBook(book1);
library.addBook(ebook1);

// Testing the library functionality
console.log('All Books:');
console.log(library.displayBooks());

console.log('\nSearch Results for "Gatsby":');
console.log(library.searchByTitle('Gatsby'));

// Exception handling for API endpoints
app.post('/addBook', (req, res) => {
  try {
    const { title, author, ISBN, fileFormat } = req.body;
    if (!title || !author || !ISBN) {
      throw new Error('Title, author, and ISBN are required');
    }

    if (fileFormat) {
      const newEBook = new EBook(title, author, ISBN, fileFormat);
      library.addBook(newEBook);
      res.status(201).json({ message: 'Book added successfully' });
    } else {
      const newBook = new Book(title, author, ISBN);
      library.addBook(newBook);
      res.status(201).json({ message: 'Book added successfully' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/listBooks', (req, res) => {
  res.json(library.displayBooks());
});

app.delete('/deleteBook/:ISBN', (req, res) => {
  const ISBN = req.params.ISBN;
  const index = library.books.findIndex(book => book.ISBN === ISBN);
  if (index !== -1) {
    library.books.splice(index, 1);
    res.json({ message: 'Book deleted successfully' });
  } else {
    res.status(404).json({ error: 'Book not found' });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
