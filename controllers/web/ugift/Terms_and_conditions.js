const logger = require('../../../utils/logger');

class Terms_and_conditions{

 index(req, res) {
  res.render('ugift/terms_and_conditions', { title: 'UGIFT - Terms and Conditions' });
 } 

}


module.exports = new Terms_and_conditions()