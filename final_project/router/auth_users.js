const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let existingUser = users.find(user => user.username === username);
    if(existingUser){
        return true;
    }else {return false};
};

const authenticatedUser = (username,password)=>{ //returns boolean
    let validUser = users.find(user=> {
        return user.username === username && user.password === password;
    });
    if(validUser){
        return true;
    } else {
        return false;
    };
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    let username = req.body.username;
    let password = req.body.password;

    //check if username or password are missing
    if(!username || !password){
        res.send("Please provide a username and password.");
    };    
    //check authentication of username and password
    if(authenticatedUser(username, password)){
        //generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', {expiresIn: '1hr'});
        //store access token and username in session
        req.session.authorization = {accessToken, username};
        return res.send('User successfully logged in.');
    } else {
        return res.send("Invalid credentials.")
    };
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let ISBN = req.params.isbn;  
  let book = books[ISBN];
  if(book){
    let username = req.session.authorization.username;
    let newReview = req.body.review;

    if((book.reviews).hasOwnProperty(username)){
        book.reviews[`${username}`] = newReview;
        res.send("User review has been updated.")
    } else {
        book.reviews[`${username}`] = newReview;
        res.send("A new review has been posted.")
    }    
  } else {
    return res.send("Book does not exist.")
  };
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  let ISBN = req.params.isbn;  
  let book = books[ISBN];
  if(book){
    let username = req.session.authorization.username;

    if((book.reviews).hasOwnProperty(username)){
        delete book.reviews[`${username}`];
        res.send("Your review has been deleted.")
    } else {        
        res.send("You have not posted a review for this book.")
    }    
  } else {
    return res.send("Book does not exist.")
  };
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
