const { ApiController } = require('./ApiController')
const { Ussc_ws } = require('../../services/Ussc_ws')
const { check, validationResult } = require('express-validator');
const logger = require('../../utils/logger');

class Notification extends ApiController{
  constructor() {
    super()
    this.ussc_ws = new Ussc_ws()
  }

  index = async () => {

    if(!this.user_id){
      return this.output_error('User id is required!');
    }
    // await body('passwordConfirmation').equals(password).withMessage('passwords do not match').run(req);
    // await check("first_name", "first name is required").notEmpty().run(this.request)
    // await check("last_name", "last name is required").notEmpty().run(this.request)

    // const errors = validationResult(this.request);
    
    // if (!errors.isEmpty()) {
    //   let err = errors.errors[0].msg;
    //   return this.output_error(err);
    // }

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

    return this.output_success('Success', response)
  }

}


module.exports = new Notification();