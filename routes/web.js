var express = require('express');
var router = express.Router();
const moneygram = require('../controllers/web/moneygram/Terms_and_conditions')
const remitly = require('../controllers/web/remitly/Terms_and_conditions')
const ugift = require('../controllers/web/ugift/Terms_and_conditions')

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Moneygram Terms and Conditions' });
// });

router.get('/web/moneygram/terms_and_conditions', function (req, res) {
  moneygram.index(req, res)
});

router.get('/web/remitly/terms_and_conditions', function (req, res) {
  remitly.index(req, res)
});

router.get('/web/ugift/terms_and_conditions', function (req, res) {
  ugift.index(req, res)
});


/* GET home page. */  
router.get('/home', function(req, res, next) {
  res.render('index', { title: 'Moneygram Terms and Conditions' });
});

module.exports = router;
