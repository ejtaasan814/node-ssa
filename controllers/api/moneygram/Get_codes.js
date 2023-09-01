const { ApiController } = require('../../../services/ApiController')
const { Umsi_api } = require('../../../services/Umsi_api')
const { check, validationResult } = require('express-validator');
const constants = require('../../../config/constants');

class Get_codes extends ApiController{
  constructor() {
    super()
    this.umsi_api = new Umsi_api(this);
  }

  index = async () => {

    if(!this.user_id){
      return this.output_error('User id is required!');
    }
    
    await check("channel_code", "channel_code is required").notEmpty().run(this.request)

    const errors = validationResult(this.request);
    
    if (!errors.isEmpty()) {
      let err = errors.errors[0].msg;
      return this.output_error(err);
    }

    let post_data = {
      "BranchCode" : constants.BPI_BRANCH_CODE,
      "UserId" : constants.UMSI_USERID,
      "TerminalId" : constants.BPI_BRANCH_CODE,
      "Channel" : this.request.body.channel_code ?  this.request.body.channel_code  : ''
    }
    const result = await this.umsi_api.moneygram_get_codes(post_data);

    if(!result.status){
      return this.output_error('Error', result.err_message ? result.err_message : constants.GENERIC_ERROR_MSG);
    }else{
      return this.output_success('Success', result);
    }
    
    
  }

}


module.exports = new Get_codes();