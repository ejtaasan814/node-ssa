
const { ApiController } = require('../../services/ApiController')
const { Ussc_ws } = require('../../services/Ussc_ws')
const constants = require('../../config/constants')

class Lifeguard_get_data extends ApiController{
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
    this.call_lifeguard_get_data();
    
  }


  call_lifeguard_get_data = async () => {
    const fee = await this.ussc_ws.lifeguard_fee_inquiry()
    const types =  await this.ussc_ws.lifeguard_get_types()
    const beneficiaries = await this.ussc_ws.lifeguard_get_beneficiaries()

    if (!fee.success || !beneficiaries.success) {
      let error = fee.error.msg;
      this.output_error(error);
    } else {

    const mobile_response = {
      types : [],
      fee: [],
      beneficiaries: []
    }

    if(types.code == constants.USSC_SUCCESS_API_CODE){
      if(types.data.lg_types != ""){
        types.data.lg_types.forEach(value => {
          value.name = value.name + " - " + value.short_description
        });
        mobile_response.types = types.data.lg_types
      }
    }

    if (fee.code == constants.USSC_SUCCESS_API_CODE){
      mobile_response.fee = fee.data; 
    } 

    if (beneficiaries.code == constants.USSC_SUCCESS_API_CODE){
      mobile_response.beneficiaries = beneficiaries.data
    } 
    this.output_success("success",mobile_response);


    }
  }

}


module.exports = new Lifeguard_get_data();