
const { ApiController } = require('../../services/ApiController')
const { Ussc_ws } = require('../../services/Ussc_ws')
const constants = require('../../config/constants')
const { check, validationResult } = require('express-validator');

class Hospiguard_transaction_inquiry extends ApiController{
  constructor() {
    super()
    this.ussc_ws = new Ussc_ws()
  }

  index = async () => {
    
    this.request.body['user_id'] = this.user_id;
    this.request.body['device_id'] = this.device_id;

    await check("user_id", "user_id is required").notEmpty().run(this.request)
    await check("device_id", "device_id is required").notEmpty().run(this.request)
    await check("panalokard", "panalokard is required").notEmpty().run(this.request)
    await check("channel_code", "channel_code is required").notEmpty().run(this.request)
    const errors = validationResult(this.request);
        
    if (!errors.isEmpty()) {
      let err = errors.errors[0].msg;
      return this.output_error(err);
    }

    const post_data = {
      "credentials" : {
        "user_id" : this.user_id,
        "device_id" : this.device_id
      },
      "channel" : {
        "code" : this.request.body.channel_code.toUpperCase()
      },
      "panalokard" : "152015036",
      "filter" : {
        "channel" : this.request.body.channel_code.toUpperCase(),
        "account_no" : "0152015036001",
        "coverage_status" : this.request.body.coverage_status
      },
      "page": this.request.body.page
    }

    const response = await this.ussc_ws.hospiguard_transaction_inquiry(post_data);

    if (!response.success) {
      let error = response.error.msg;
      this.output_error(error);
    } else {
        if (response.code == constants.USSC_SUCCESS_API_CODE){
            let responseOutput = response.data;
            this.output_success("Success.", responseOutput);
        } else if (response.message){
            this.output_error(response.message);
        } else {
            this.output_error(constants.GENERIC_ERROR_MSG);
        }
    }
    
    
  }


}


module.exports = new Hospiguard_transaction_inquiry();