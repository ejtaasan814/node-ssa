
const { ApiController } = require('../../services/ApiController')
const { Ussc_ws } = require('../../services/Ussc_ws')
const constants = require('../../config/constants')
const filter = require('jade/lib/filters')

class Lifeguard_get_policies extends ApiController{
  constructor() {
    super()
    this.ussc_ws = new Ussc_ws()
  }

  index = async () => {

    let error_msg = "";
    let channel_code = "";
    let filter = "";

    if(!this.user_id){
      error_msg = "user_id is required. "; 
    }else if (!this.device_id) {
      error_msg = "device_id is required. "; 
    }else if(!this.request.body.panalokard){
      error_msg = "panalokard is required. "; 
    }else if (this.request.body.channel_code) {
       channel_code = this.request.body.channel_code;
      if(channel_code != "M" && channel_code != "K") {
          error_msg = "Invalid Channel Code."; 
      }
    }

    if (error_msg != ""){
      return this.output_error(error_msg);
    }

    if(this.request.body.filter){
        filter = JSON.parse(this.request.body.filter)
    }

    const post_data = {
      "channel" : {
        "code" : channel_code ? this.channel_code : 'M',
      },
      "credentials" : {
        "user_id" : this.user_id,
        "device_id" : this.device_id
      },
      "panalokard" : "152015036",
      "filter" : {
        "date" : filter.date ? filter.date : "",
        // // A = Active or E = Expired
        "coverage_status" : filter.coverage_status ? filter.coverage_status : ""
      },
      "page" : this.request.body.page
    }

    this.call_lifeguard_get_policies(post_data);
    
  }

  call_lifeguard_get_policies = async (post_data) => {

    const response = await this.ussc_ws.lifeguard_get_policies(post_data);

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


module.exports = new Lifeguard_get_policies();