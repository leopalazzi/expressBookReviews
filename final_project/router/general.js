const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (!isValid(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  const promise = new Promise((resolve,reject) => {
      resolve(books)
  });

  promise.then(books => {
    res.send(JSON.stringify(books,null,4));
  })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const {isbn} = req.params;
  const promise = new Promise((resolve,reject) => {
    if(!books[isbn])
    {
      reject(new Error(`Not able to retrieve this book with isbn ${isbn}`))
    }
    resolve(books[isbn])
  });
  promise.then((book) => {
    res.send(book)
  }).catch(err => {
    res.status(404).send(err.message)
  });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const {author} = req.params;
  const promise = new Promise((resolve,reject) => {
    const isbns = Object.keys(books);
    isbns.forEach(isbn => {
      const currentBook = books[isbn];
      if(currentBook.author === author)
      {
        resolve(currentBook);
      }
    });
    reject(new Error(`Not found the book with author ${author}`));
  });
  promise.then((book) => {
    res.send(book);
  }).catch(err => {
    res.status(404).send(err.message);
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const {title} = req.params;
  const promise = new Promise((resolve,reject) => {
    const isbns = Object.keys(books);
    isbns.forEach(isbn => {
      const currentBook = books[isbn];
      if(currentBook.title === title)
      {
        resolve(currentBook);
      }
    });
    reject(new Error(`Not found the book with title ${title}`));
  });
  promise.then((book) => {
    res.send(book);
  }).catch(err => {
    res.status(404).send(err.message);
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const {isbn} = req.params;
  const promise = new Promise((resolve,reject) => {
    const book = books[isbn];
    if(!book){
      reject(new Error(`Not found the review book with isbn ${isbn}`));
    }
    resolve(book.review);
  });
  promise.then((review) => {
    res.send(review);
  }).catch(err => {
    res.status(404).send(err.message);
  });
});

module.exports.general = public_users;
