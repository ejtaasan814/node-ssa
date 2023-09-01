const { ApiController } = require('../../services/ApiController')
const { Umsi_api } = require('../../services/Umsi_api')
const { check, validationResult } = require('express-validator');
const logger = require('../../utils/logger');

class Get_top_banks_ewallets extends ApiController{
  constructor() {
    super()
    this.umsi_api = new Umsi_api(this);
  }

  index = async () => {

    if(!this.user_id){
      return this.output_error('User id is required!');
    }
    // await body('passwordConfirmation').equals(password).withMessage('passwords do not match').run(req);
    // await check("first_name", "first name is required").notEmpty().run(this.request)
    // await check("last_name", "last name is required").notEmpty().run(this.request)

    // const errors = validationResult(this.request);
    
    // if (!errors.isEmpty()) {
    //   let err = errors.errors[0].msg;
    //   return this.output_error(err);
    // }

    const result = this.umsi_api.send_request();

   
    return this.output_success('Success', result);
    
    // return this.output_success('Success', json_data)
    
  }

}


module.exports = new Get_top_banks_ewallets();