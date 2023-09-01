const logger = require('../../../../utils/logger');

class Terms_and_conditions{

 remap(req, res) {
  // res.render('index', { title: 'Moneygram Terms and Conditions' });
    const service = req.params.service ? req.params.service.toUpperCase() : '';
    switch(service) {
      case 'UGIFT':
        res.send('UGIFT')
        break;

      case 'REMITLY':
        res.render('remitly/terms_and_conditions', { title: 'REMITLY - Terms and Conditions' });
        break;

      case 'SUPER_PADALA':
        res.render('super_padala/terms_and_conditions', { title: 'SUPER PADALA - Terms and Conditions' });
        break;

      case 'WESTERN_UNION':
        res.render('western_union/terms_and_conditions', { title: 'WESTERN UNION - Terms and Conditions' });
        break;

      case 'MONEYGRAM':
        res.render('moneygram/terms_and_conditions', { title: 'MONEYGRAM - Terms and Conditions' });
        break;

      case 'UNITELLER':
        res.send('UNITELLER')
        break;

      default:
        res.render('agreements/terms_and_conditions', { title: 'Terms and Conditions' });
        break;
    }
 } 

}


module.exports = new Terms_and_conditions()