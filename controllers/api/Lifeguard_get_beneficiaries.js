
const { ApiController } = require('../../services/ApiController')
const { Ussc_ws } = require('../../services/Ussc_ws')
const constants = require('../../config/constants')

class Lifeguard_get_beneficiaries extends ApiController{
  constructor() {
    super()
    this.ussc_ws = new Ussc_ws()
  }

  index = async () => {

    let error_msg = "";

    if(!this.user_id){
         error_msg = "user_id is required. "; 
    }else if (!this.device_id) {
         error_msg = "device_id is required. "; 
    }

    if (error_msg != ""){
      return this.output_error(error_msg);
    }
    this.call_lifeguard_get_beneficiaries();
    
  }


  call_lifeguard_get_beneficiaries = async () => {
    let response =  await this.ussc_ws.lifeguard_get_beneficiaries()
    
    if (!response.success) {
      let error = response.error.msg;
      this.output_error(error);
    } else {
        if (response.code == constants.USSC_SUCCESS_API_CODE){
            let responseOutput = response.data;
            this.output_success("Success", responseOutput);
        } else if (response.message){
            this.output_error(response.message);
        } else {
            this.output_error(constants.GENERIC_ERROR_MSG);
        }
    }
  }

}


module.exports = new Lifeguard_get_beneficiaries();