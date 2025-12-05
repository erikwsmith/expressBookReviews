const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    let username = req.body.username;
    let password = req.body.password;
    let existingUser = users.find(user => user.username === username);
    if(existingUser){
        return res.send("User already exists.");
    };
    if(!username || !password){
        return res.send("Please provide a username and password.");
    };
    users.push({
        "username": username,
        "password": password
    });
    return res.send("User '" + username + "' was successfully added.")
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {  
  return res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let ISBN = req.params.isbn;
    let book = books[ISBN];
    if(book){
        return res.send(JSON.stringify(book));
    }else {
        return res.send("ISBN not found.");
    };
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let author = req.params.author;
    let authorArray = [];
    for(let book in books) {
        if(books[book].author === author){
            authorArray.push(books[book]);
        };
    };
    if(authorArray.length > 0){
        return res.send(JSON.stringify(authorArray));
    }else {
        return res.send("Author not found.");
    };
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
    let titleArray = [];
    for(let book in books){
        if(books[book].title === title){
            titleArray.push(books[book]);
        };
    };
    if(titleArray.length > 0){
        return res.send(JSON.stringify(titleArray));
    } else {
        return res.send("Title not found.");
    };
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let ISBN = req.params.isbn;
  let book = books[ISBN];
    if(book){
        return res.send(JSON.stringify(book.reviews));
    }else {
        return res.send("ISBN not found.");
    };
});

module.exports.general = public_users;
