const logger = require('../../../../utils/logger');

class Privacy_policy{

 remap(req, res) {
  res.render('agreements/privacy_policy', { title: 'Privacy policy' });
 } 

}


module.exports = new Privacy_policy()