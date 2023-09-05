const crypto = require('crypto');
const { Mobile_session } = require('../models/Mobile_session');
const constants = require('../config/constants');
const { compare } = require('compare-versions');
const logger = require('../utils/logger');

class ApiController {
  
  constructor() {
    this.mobile_session_model = new Mobile_session()
  }

  remap = async (req, res) => {
    this.request = req
    this.response = res
    const origurl = req.originalUrl;
    const urlArr = origurl.split("/");
    let router_class = urlArr.slice(-1).toString();
    const request_class_method = !req.params.method ? 'index' : req.params.method;

    this.method = req.method
    this.router_class = router_class

    this.request_class_method = request_class_method

    logger("info", '------------------------------------------')
    logger("info", 'SSA POST DATA '+JSON.stringify(req.body))
    logger("info", 'SSA API METHOD '+ origurl)

    const {
      debug,
      version,
      platform,
      device_id,
      request_id,
      session_id,
      user_id,
      current_coordinates,
      signature,
      ip_address,
      os_version,
      hardware_version,
      channel_code
    } = req.body

    this.platform = platform || ''
    this.version = version || '0'
    this.device_id = device_id || ''
    this.request_id = request_id || ''
    this.session_id = session_id || ''
    this.user_id = user_id || ''
    this.current_coordinates = current_coordinates || ''
    this.signature = signature || ''
    this.ip_address = ip_address || ''
    this.os_version = os_version || ''
    this.hardware_version = hardware_version || '' 

    this.channel_code = channel_code || ''

    

    //clean required post data
    delete req.body.platform;
    delete req.body.version;
    delete req.body.device_id;
    delete req.body.request_id;
    delete req.body.session_id;
    delete req.body.user_id;
    delete req.body.signature;
    delete req.body.ip_address;
    delete req.body.os_version;
    delete req.body.hardware_version;

    if(!this.check_version(this.version)){
      this.output_error("We have a new update with SUPER upgrades and improvements to serve you better! \n Download now!");
    }else{
      if (1 == debug && constants.ENVIRONMENT == 'development') {
        this.add_mobile_session()
        this.execute_request(req, res)
      }else{

          const is_session_expired = await this.is_session_expired();
          const is_request_duplicate = await this.is_request_duplicate();
          const is_signature_invalid = await this.is_signature_invalid(req.body);

          if(this.router_class == 'fee_inquiry' || this.router_class == 'pickup_validation'){
            this.update_version_checker();
          } 

            //removed checking of session in this class name
            const arr_class_names = [
              'login',
              'logout',
              'get_faq',
              'lifeguard_get_requirements',
              'get_app_messages',
              'enroll_kiosk_device',
              'kiosk_login',
              'change_mpin',
              'get_signup_params',
              'signup',
              'get_panalokard_details',
              'waive_password',
              'signup_otp',
              'get_photo',
              'reset_password',
              'biometrics_check',
              'ekyc_get_list',
              'ekyc_check_user',
              'ekyc_register',
              'fund_transfer',
              'ekyc_otp',
              'check_username',
              'get_municipality'
          ];
          if(arr_class_names.includes(this.router_class)){
            this.add_mobile_session()
            this.execute_request(req, res)
          }
          if(is_request_duplicate){
            this.output_error('ERROR: duplicate request')
          }else if(is_session_expired){
            this.output_error('ERROR: session expired.')
          }else if (is_signature_invalid){
            this.output_error('ERROR: Invalid Signature.')
          }else if (this.is_device_id_invalid()) {
            this.output_error('ERROR: device id invalid.')
          }else{
            this.add_mobile_session()
            this.execute_request(req, res)
          }
      }
    }
  
  }

  generate_session_id = () => {
    return crypto.randomUUID();
  }

  update_version_checker = () => {
    const channels = [ constants.CHANNEL_KIOSK, constants.CHANNEL_WEB, constants.CHANNEL_MERCHANT, constants.CHANNEL_MERCHANT_DSWD ];
    if(channels.includes(this.channel_code.toUpperCase())){
      return true;
    }else{
        const version_to_check = this.platform == 'ios' ? constants.IOS_VERSION  : constants.ANDROID_VERSION;
        if (compare(this.version, version_to_check, '>')) {
            return;
        }else{
            return "To further ensure the validity and security of your Western Union transactions, the latest version of the USSC Super Service APP is now available in GooglePlay or Apple Store! Update your APP first to continue your transaction.";
        }
    }
  }

  check_version = ($v = 0) => {
    const channels = [ constants.CHANNEL_KIOSK, constants.CHANNEL_WEB, constants.CHANNEL_MERCHANT, constants.CHANNEL_MERCHANT_DSWD ];
    if(channels.includes(this.channel_code.toUpperCase())){
        return true;
    }else{
        const version_to_check = this.platform == 'ios' ? constants.FORCE_UPDATE_IOS  : constants.FORCE_UPDATE_ANDROID;
        if (compare(this.version, version_to_check, '>')) {
            return true;
        }else{
            //user need to update
            return false;
        }
    }
  }

  add_mobile_session = async () => {
    // generate new session id
    this.new_session_id = this.generate_session_id();

     // generate expiration
    const date_time = new Date()
    date_time.setDate(date_time.getDate() + 5);
    const expiration = `${date_time.getFullYear()}-${("0" + (date_time.getMonth() + 1)).slice(-2)}-${("0" + date_time.getDate()).slice(-2)} ${date_time.getHours()}:${date_time.getMinutes()}:${date_time.getSeconds()}`

    let session_data = {
      "class" : this.router_class,
      "method" : this.method,
      "platform" : this.platform,
      "version" : this.version,
      "device_id" : this.device_id,
      "request_id" : this.request_id,
      "session_id" : this.new_session_id,
      "users_id" : this.user_id,
      "device_signature" : this.signature,
      "ip_address" : this.ip_address,
      "current_coordinates" : this.current_coordinates,
      "os_version" : this.os_version,
      "hardware_version" : this.hardware_version,
      "expiration" : expiration
    }

    this.mobile_session_model.add(session_data)
    return
    
  }

  is_session_expired = async () => {
    const is_exist = await this.mobile_session_model.is_session_id_exist(this.session_id)
      
    if (is_exist) {

      const date_time = new Date()
      // get record
      const rec = await this.mobile_session_model.get_record(this.session_id);
      const current_datetime = `${date_time.getFullYear()}-${("0" + (date_time.getMonth() + 1)).slice(-2)}-${("0" + date_time.getDate()).slice(-2)} ${date_time.getHours()}:${date_time.getMinutes()}:${date_time.getSeconds()}`

      // check for expiration ..
      if (current_datetime > rec[0].expiration) {
          return true;
      } else {
          return false;
      }

    } else {
        return true;
    }
  }

  is_request_duplicate = async () => {

    const is_exist = await this.mobile_session_model.is_request_id_exist(this.request_id);
    
    if (is_exist) {
        return true;
    } else {
        return false;
    }
  }

  is_signature_invalid =  async (params) => {
    let data =''
    if ((this.platform == "ios" && (!this.os_version)) || ((this.platform == "android") && (!this.os_version))) {
      delete params.current_coordinates;
      data = this.platform + this.version + this.device_id + this.request_id + this.session_id + this.user_id + this.ip_address + this.os_version + this.hardware_version +this.current_coordinates;
    } else {
        data = this.platform + this.version + this.device_id + this.request_id + this.session_id + this.user_id;
    }

    let posts = Object.values(params);

    posts.forEach((post) => {
      data += post
    });
    
    logger("info", `PARAMS ${JSON.stringify(params)}`);
    logger("info",data);
    const sig = crypto.createHash('sha512').update(data).digest('hex');
    logger("info",sig);

    if (sig != this.signature) {
      if (this.platform == 'ios' && this.router_class == 'decode_qr_code') {
          return false;
      } else {
          return true;
      }
    }else {
        return false;
    }
  }

  is_device_id_invalid = () => {
    return false;
  }

  execute_request = (req, res) => {
    
    var propertyNames = Object.getOwnPropertyNames(this);
    try {
      if(!propertyNames.includes(this.request_class_method)){
        res.send('ERROR: API not found!');
        return;
      }
      this[this.request_class_method]();  
    } catch (error) {
      res.status(400).send({ error: error })
    }
    
  }

  output_success = (message, result='') => {
    const date_time = new Date()
    const current_datetime = `${date_time.getFullYear()}-${("0" + (date_time.getMonth() + 1)).slice(-2)}-${("0" + date_time.getDate()).slice(-2)} ${date_time.getHours()}:${date_time.getMinutes()}:${date_time.getSeconds()}`
    
    const response = {
      'completed_in': 0,
      'status': 1,
      'message': message || 'Success',
      'session_id': this.new_session_id || '',
      'request_id': this.request_id,
      'ts': current_datetime
    }
    
    if(result){
      response.results = result
    }
    
    // logger.token('postresponse', function (req, res) { return JSON.stringify(response) })
    logger("info",`SSA SUCCESS RESPONSE ${JSON.stringify(response)}`)
    this.response.send(response)
    return;
    
  }

  output_error = (message) => {
    const date_time = new Date()
    const current_datetime = `${date_time.getFullYear()}-${("0" + (date_time.getMonth() + 1)).slice(-2)}-${("0" + date_time.getDate()).slice(-2)} ${date_time.getHours()}:${date_time.getMinutes()}:${date_time.getSeconds()}`
    const response = {
      completed_in: 0,
      status: 0,
      message: message || 'Error',
      session_id: this.new_session_id,
      request_id: this.request_id,
      ts: current_datetime
    }
    logger("info", 'SSA ERROR RESPONSE')
    logger("info", JSON.stringify(response))
    this.response.send(response)
    return;
  }

  
}


module.exports = { ApiController }