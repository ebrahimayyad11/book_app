'use strict';
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');




const server = express();
const PORT = process.env.PORT || 5000;
server.use(cors());

server.use(express.static(__dirname + '/public'));
server.set('view engine','ejs');
server.use(express.urlencoded({extended:true}));


let client;
let DATABASE_URL = process.env.DATABASE_URL;
client = new pg.Client({
  connectionString: DATABASE_URL,
});

server.get('/',(req,res) => {
  let query = `SELECT * FROM books;`;
  client.query(query)
    .then(result => {
      res.render('pages/index', { books: result.rows});
    });
});

server.get('/search', (req, res) => {
  res.render('./pages/searches/show.ejs');
});


function Books (obj){
  this.title = obj.volumeInfo.title || 'Title is not available';
  this.author = obj.volumeInfo.author || 'Author is not available';
  this.description = obj.volumeInfo.description || 'Description is not available';
  this.img = obj.volumeInfo.imageLinks.thumbnail || `https://i.imgur.com/J5LVHEL.jpg`;
  this.ISBN = obj.volumeInfo.industryIdentifiers[0].identifier || 'ISBN is not available';
}


server.post('/searches/new', searchHandler);

function searchHandler(req, res) {
  let search = req.body.search;
  let searchType = req.body.searchType;
  let booksUrl = `https://www.googleapis.com/books/v1/volumes?q=+${search}:${searchType}`;
  superagent.get(booksUrl)
    .then((bookData) => {
      let getData = bookData.body;
      let booksArr = getData.items.map((item) =>{
        let newBook = new Books(item);
        return newBook;
      });
      res.render('pages/searches/new',{books:booksArr});
    })
    .catch(error => {
      res.send(error);
    });
}


server.get('/books/:id', bookIdHandler);
server.post('/books', BookHandler);

function bookIdHandler(req, res) {
  let query = `SELECT * FROM books WHERE id=$1;`;
  let values = [req.params.id];
  client.query(query, values)
    .then(result => {
      res.render('pages/books/details', { books: result.rows[0] });
    });
}

function BookHandler(req, res) {
  console.log(req.body);
  let { img, title, author, description, ISBN} = req.body;
  let query = `INSERT INTO books (img,title,author,descriptions,ISBN) VALUES ($1,$2,$3,$4,$5) RETURNING *;`;
  let values = [img, title, author, description, ISBN];
  console.log(values);
  client.query(query, values)
    .then(result => {
      // console.log(result.rows)
      res.redirect(`/books/${result.rows[0].id}`);
    });
}





client.connect()
  .then(()=>{
    server.listen(PORT,()=>{
      console.log(`listening to port ${PORT}`);
    });
  });
