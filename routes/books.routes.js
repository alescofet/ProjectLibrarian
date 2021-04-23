const express = require('express');
const router  = express.Router();
const axios = require(`axios`)
let search = ``
let startIndex = 0

router.post(`/search-query`,(req,res) => {
search = req.body.search
console.log(search)
res.redirect(`/books/search`)
})




router.get(`/search`,(req,res)=>{
axios.get(`https://www.googleapis.com/books/v1/volumes?q=${search}&startIndex=${startIndex}&maxResults=9`)
.then((result)=>{
console.log(result.data.items)
const layout = req.user ? '/layouts/auth' : '/layouts/noAuth'
res.render(`search`,{books: result.data.items, layout: layout})
})
.catch((err)=>{
console.log(err)
})
})

router.get(`/nextPage`,(req,res)=>{
    startIndex += 10
    res.redirect(`/books/search`)
  })
  
  router.get(`/firstPage`,(req,res)=>{
    startIndex=0
    res.redirect(`/books/search`)
  })
  
  router.get(`/previousPage`,(req,res)=>{
    startIndex -= 10
    if(startIndex < 9){
        startIndex = 0
      res.redirect(`/books/search`)
    }else{res.redirect(`/books/search`)}
  })




module.exports = router;


