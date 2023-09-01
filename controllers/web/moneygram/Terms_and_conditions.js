const logger = require('../../../utils/logger');

class Terms_and_conditions{

 index(req, res) {
  res.render('moneygram/terms_and_conditions', { title: 'Moneygram Terms and Conditions' });
  // res.send(req.originalUrl)
 } 

}


module.exports = new Terms_and_conditions()