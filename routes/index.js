var express = require('express');
var router = express.Router();
const Link = require('../models/link')


function gencode() {
  let possible = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let text = ''
  for(let x = 0; x < 4; x++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}


router.get('/', function (req, res) {
  res.render('index')

})

router.post('/newcut', async (req, res) => {
  if (!req.body.link || req.body.link.length < 5) {
    req.flash("error_msg", "Invalid link")
    res.redirect('/')
  }
  else {
    const code = "http://localhost:8082/"+gencode()
    const link = Link.build(({
      code: code,
      url: req.body.link,
      hits: 0
    }))
    res.render('urlcut', {code:code})
  }
})

router.get('/:code', async (req, res) => {
  res.render('urlcut')
})

module.exports = router;
