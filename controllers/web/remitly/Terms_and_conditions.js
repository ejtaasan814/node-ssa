const logger = require('../../../utils/logger');

class Terms_and_conditions{

 index(req, res) {
  res.render('remitly/terms_and_conditions', { title: 'REMITLY - Terms and Conditions' });
 } 

}


module.exports = new Terms_and_conditions()