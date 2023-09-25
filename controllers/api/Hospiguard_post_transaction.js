
const { ApiController } = require('../../services/ApiController')
const { Ussc_ws } = require('../../services/Ussc_ws')
const constants = require('../../config/constants')
const { Mcrypt } = require('../../services/Mcrypt')
const { check, validationResult } = require('express-validator');

class Hospiguard_post_transaction extends ApiController{
  constructor() {
    super()
    this.ussc_ws = new Ussc_ws()
    this.mcrypt = new Mcrypt()
  }

  index = async () => {
    
    this.request.body['user_id'] = this.user_id;
    this.request.body['device_id'] = this.device_id;

    await check("user_id", "user_id is required").notEmpty().run(this.request)
    await check("device_id", "device_id is required").notEmpty().run(this.request)
    await check("panalokard", "panalokard is required").notEmpty().run(this.request)
    await check("channel_code", "channel_code is required").notEmpty().run(this.request)
    await check("panalowallet", "channel_code is required").notEmpty().run(this.request)
    await check("beneficiary", "channel_code is required").notEmpty().run(this.request)
    const panalowallet = JSON.parse(this.request.body.panalowallet)
    const beneficiary = JSON.parse(this.request.body.beneficiary)
    
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
      "panalowallet" : {
        "currency" : panalowallet.currency,
        "account_no" : await this.mcrypt.my_decrypt(panalowallet.account_no),
      },
      "panalokard" : await this.mcrypt.decrypt(this.request.body.panalokard),
      "beneficiary" : {
        "first_name" : beneficiary.first_name,
        "middle_name" : beneficiary.middle_name,
        "last_name" : beneficiary.last_name,
        "relationship_id" : beneficiary.relationship_id,
      },
      "start_coverage" : this.request.body.start_coverage,
      "end_coverage" : this.request.body.end_coverage,
      "coverage" : this.request.body.coverage_id,
      "no_of_units" : this.request.body.no_of_units
    }

    const response = await this.ussc_ws.hospiguard_post_transaction(post_data);

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


module.exports = new Hospiguard_post_transaction();