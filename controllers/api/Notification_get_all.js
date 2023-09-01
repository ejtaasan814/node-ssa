const { ApiController } = require('../../services/ApiController')
const { Ussc_ws } = require('../../services/Ussc_ws')
const constants = require('../../config/constants')

class Notification_get_all extends ApiController{
  constructor() {
    super()
    this.ussc_ws = new Ussc_ws()
  }

  index = async () => {

    if(!this.user_id){
      return this.output_error('User id is required!');
    }

    let type = '';
    if(this.request.body.type){
        type = this.request.body.type == 1 ? "PROMO" : "ANNOUNCE";
    }else{
        type = 'ALL';
    }

    const json_data = {
      "channel" :{
        "code": "M"
      },
      "type": type,
      "user_id": this.user_id
    }
    this.call_notification_get_all(json_data);
    
    // return this.output_success('Success', json_data)
    
  }


  call_notification_get_all = async (post_data) => {
    let response =  await this.ussc_ws.notification_get_all(post_data)

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


module.exports = new Notification_get_all();