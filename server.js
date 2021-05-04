'use strict';
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const superagent = require('superagent');




const server = express();
const PORT = process.env.PORT || 5000;
server.use(cors());

server.use(express.static(__dirname + '/public'));
server.set('view engine','ejs');
server.use(express.urlencoded({extended:true}));

server.get('/',(req,res) => {
  res.render('pages/index');
});

server.get('/search', (req, res) => {
  res.render('./pages/searches/show.ejs');
});


function Books (obj){
  this.title = obj.volumeInfo.title || 'Title not available';
  this.author = obj.volumeInfo.author || 'Author not available';
  this.description = obj.volumeInfo.description || 'Description not available';
  this.img = obj.volumeInfo.imageLinks.thumbnail || `https://i.imgur.com/J5LVHEL.jpg`;
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
        return new Books(item);
      });
      res.render('pages/searches/new',{books:booksArr});
    })
    .catch(error => {
      res.send(error);
      console.log(error);
    });
}

server.listen(PORT,() => {
  console.log(`listing to PORT ${PORT}`);
});
