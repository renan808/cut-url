var express = require('express');
var router = express.Router();
const Link = require('../models/link')
const axios = require('axios').default;


function gencode() {
  let possible = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let text = ''
  for(let x = 0; x < 4; x++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

router.get('/:code/status', async (req, res) => {
  const status = await Link.findOne({where: {code: process.env.DOMAIN+req.params.code}})
  if (status) {
    res.render('status', {status: status, hits: status.hits})
  }
})

router.get('/:code', async (req, res) => {
  const redirect = await Link.findOne({where: {code: process.env.DOMAIN+req.params.code}})
  console.log(req.url)
  if (redirect === null) {
    res.redirect('/404')
  } else {
    await Link.update({hits: redirect.hits += 1}, {where: {code: redirect.code}})
    res.redirect(redirect.url)
  }
})



router.get('/404', async (req, res) => {
  res.render('404')
})




router.get('/', function (req, res) {
  console.log(process.env.DOMAIN)
  res.render('index')

})


router.post('/newcut', async (req, res, next) => {
  const test = await Link.findOne({where: {url: req.body.link}})
  if (test && test.url.length > 0) {
    res.render('urlcut', {code: test.code})
  }
  else {
    axios.get(req.body.link).then(() => {
      const code =  process.env.DOMAIN+gencode()
      const link = Link.build(({
        code: code,
        url: req.body.link,
        hits: 0}))
      link.save()
      res.render('urlcut', {code:code})
    }).catch((err) => {
      req.flash("error_msg", "Invalid link")
      res.redirect('/')
    })}
})
module.exports = router;
