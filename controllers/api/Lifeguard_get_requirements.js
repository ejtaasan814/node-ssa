
const { ApiController } = require('../../services/ApiController')
const { Ussc_ws } = require('../../services/Ussc_ws')
const constants = require('../../config/constants')

class Lifeguard_get_requirements extends ApiController{
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
    const file = "claim_requirements.html";

    const response = await this.ussc_ws.send_request_get_file(file, this.platform);

    return this.response.send(response)
    
  }



}


module.exports = new Lifeguard_get_requirements();