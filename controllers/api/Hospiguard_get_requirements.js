
const { ApiController } = require('../../services/ApiController')
const { Ussc_ws } = require('../../services/Ussc_ws')
const constants = require('../../config/constants')

class Hospiguard_get_requirements extends ApiController{
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

    const file = "product_guide.html";
    const file_url = constants.USSC_SERVER + constants.HOSPIGUARD_GET_FILE + file;

    const response = await this.ussc_ws.send_request_file(file_url, file, this.platform);

    return this.response.send(response)
    
  }



}


module.exports = new Hospiguard_get_requirements();