const { ApiController } = require('../../services/ApiController')
const { Ussc_ws } = require('../../services/Ussc_ws')
const constants = require('../../config/constants')
const { Otp_api } = require('../../services/Otp_api')
const logger = require('../../utils/logger');
const { Otp_model } = require('../../models/Otp_model');
const querydb  = require('../../config/database.js');

class Mobile_otp extends ApiController{
  constructor() {
    super()
    this.otp_api = new Otp_api()
    this.otp_model = new Otp_model()
  }

  index = async () => {

    if(!this.user_id){
      return this.output_error('User id is required!');
    }
    // const json_data = {
    //   "channel" :{
    //     "code": "M"
    //   },
    //   "type": type,
    //   "user_id": this.user_id
    // }
    // this.call_notification_get_all(json_data);
    
    return this.output_success('Success')
    
  }


  generate = async () => {
      const post_data = {
        "user_id" : !this.user_id ? '' : this.user_id.trim(),
        "mobile_no" : !this.request.body.mobileno ? '' : this.request.body.mobileno.trim(),
        "pcode" : "RESEND"
      };
      const response = await this.otp_api.generate(post_data);
      if(response){
        logger("info", `OTP Generate: ${JSON.stringify(response)}`);
      }

      if (response.status == "0"){
          const error = response.message;
          return this.output_error(error);

      }else {
          return this.output_success(response.message);
      }

  }


  verify = async () => {
    const post_data = {
      "user_id" : !this.user_id ? '' : this.user_id.trim(),
      "mobile_no" : !this.request.body.mobileno ? '' : this.request.body.mobileno.trim(),
      "code" : !this.request.body.otp_code ? '' : this.request.body.otp_code
    };
    const response = await this.otp_api.verify(post_data);
    if(response){
      logger("info", `OTP Verify: ${JSON.stringify(response)}`);
    }

    if (response.status == "0"){
        const error = response.message;
        return this.output_error(error);

    }else {
        return this.output_success('Success', response.message);
    }

  }


}


module.exports = new Mobile_otp();