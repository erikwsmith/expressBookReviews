const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    let username = req.body.username;
    let password = req.body.password;
    if(isValid(username)){
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
public_users.get('/', async (req, res) => {  
    const bookPromise = new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve(books);
        },2000);        
    });
    const bookData = await bookPromise;
    res.send(JSON.stringify(bookData));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    let ISBN = req.params.isbn;
    const bookPromise = new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve(books);
        },2000);        
    });
    const bookData = await bookPromise;        
    let book = bookData[ISBN];
    if(book){
        return res.send(JSON.stringify(book));
    }else {
        return res.send("ISBN not found.");
    };    
});
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    let author = req.params.author;
    let authorArray = [];
    const bookPromise = new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve(books);
        },2000);        
    });
    const bookData = await bookPromise; 
    for(let book in bookData) {
        if(bookData[book].author === author){
            authorArray.push(bookData[book]);
        };
    };
    if(authorArray.length > 0){
        return res.send(JSON.stringify(authorArray));
    }else {
        return res.send("Author not found.");
    };
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    let title = req.params.title;
    let titleArray = [];
    const bookPromise = new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve(books);
        },2000);        
    });
    const bookData = await bookPromise; 
    for(let book in bookData){
        if(bookData[book].title === title){
            titleArray.push(bookData[book]);
        };
    };
    if(titleArray.length > 0){
        return res.send(JSON.stringify(titleArray));
    } else {
        return res.send("Title not found.");
    };
});

//  Get book review
public_users.get('/review/:isbn', async (req, res) => {
  let ISBN = req.params.isbn;
  const bookPromise = new Promise((resolve, reject)=>{
    setTimeout(()=>{
        resolve(books);
    },2000);        
});
const bookData = await bookPromise; 
  let book = bookData[ISBN];
    if(book){
        return res.send(JSON.stringify(book.reviews));
    }else {
        return res.send("ISBN not found.");
    };
});

module.exports.general = public_users;
