const express = require('express');
const router  = express.Router();
const axios = require(`axios`);
const Book = require('../models/Book.model');
const User = require('../models/User.model');
let search = ``
let startIndex = 0
const cleanString = (text) => {
  const regex = /(<([^>]+)>)/ig
  return text.replace(regex, "");
}




router.post(`/search-query`,(req,res) => {
search = req.body.search
startIndex = 0
res.redirect(`/books/search`)
})


router.get(`/search`,(req,res)=>{
axios.get(`https://www.googleapis.com/books/v1/volumes?q=${search}&startIndex=${startIndex}&maxResults=12`)
.then((result)=>{
const layout = req.user ? '/layouts/auth' : '/layouts/noAuth'
res.render(`search`,{books: result.data.items, layout: layout})
})
.catch((err)=>{
console.log(err)
})
})

/* GET Book details */
router.get(`/book-details/:book_id`, (req, res) => {
  axios.get(`https://www.googleapis.com/books/v1/volumes/${req.params.book_id}`)
    .then((result) => {
      const book_id = result.data.id;
      let {title,authors,pageCount,publishedDate,description} = result.data.volumeInfo;
      description = cleanString(description)
      console.log(description);
      
      const thumbnail = result.data.volumeInfo.imageLinks.thumbnail;
      Book.findOne( {book_id} )
        .then((book) => {
          if (book) {
            const layout = req.user ? '/layouts/auth' : '/layouts/noAuth'
            res.render(`book-details`, { bookDetails: book , layout: layout});
          } else {
            Book.create({book_id,title,authors,pageCount,publishedDate,description,thumbnail})
            .then((result) => {
              const layout = req.user ? '/layouts/auth' : '/layouts/noAuth'
              res.render(`book-details`, {bookDetails: result, layout: layout})
            });
          }
        })
        .catch((err) => {
          console.log(err)
        });
    });
});

/* GET navigate pages */
router.get(`/nextPage`,(req,res)=>{
    startIndex += 13
    res.redirect(`/books/search`)
  })
  
  router.get(`/firstPage`,(req,res)=>{
    startIndex=0
    res.redirect(`/books/search`)
  })
  
  router.get(`/previousPage`,(req,res)=>{
    startIndex -= 13
    if(startIndex < 13){
        startIndex = 0
      res.redirect(`/books/search`)
    }else{res.redirect(`/books/search`)}
  })




module.exports = router;



