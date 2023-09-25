const axios = require('axios');
const logger = require('../utils/logger');
const db_logger = require('../utils/db_logger');
const https = require('https');
const constants = require('../config/constants');
const { Otp_model } = require('../models/Otp_model');
const { throws } = require('assert');
const { stat } = require('fs');
const { mobile } = require('jade/lib/doctypes');

class Otp_api {
  
  constructor (gi) {
    this.global_obj = gi;
    this.otp_model = new Otp_model();
  }
  
  generate = async (post_data) =>{

    let otp_status;
    let msg;
    let sms;
    let status;

    const mobile_no = post_data.mobile_no.trim();
    const user_id = post_data.user_id.trim();
    const pcode = (!post_data.pcode) ? "" : post_data.pcode;
    delete post_data.pcode;
    post_data.status = "1";
   
    const is_valid = this.validate_data(post_data);
    status = '0';
    const tries = await this.otp_model.get_no_tries(post_data);    

    if (tries >= 3){
        //CHECK IF LOCKED ACCOUNT
        // $this->call_locked_account($user_id,$mobile_no);
        // $msg = "You have exceeded the maximum limit of tries, your account has been locked.";
        msg = 'You have exceeded the maximum limit of tries, your account has been locked.';
    } else if (is_valid.req_status == '1'){
      const is_ok = await this.otp_model.get_time_interval(post_data);

      if(is_ok){
        let otp_stats = await this.otp_model.get_otp_status(user_id);

        if (!otp_stats || otp_stats == "0"){
            //GENERATE OTP FIRST TIME
            otp_status = "0";
        } else {
            otp_status = "1";
        }

        post_data.code = otp_status;
        post_data.code = await this.otp_model.get_otp_code(post_data);
        post_data.expiration = await this.get_expiration();
        const generate_code = await this.otp_model.otp_add(post_data);

        if (!generate_code) {
          logger("info", `GENERATE OTP FAILED. `);
          logger("info", `Mobile: ${mobile_no}`);
          let msg = "Failed. Please try again later.";
          
        } else {

          let sms = `Your One Time Password (OTP) is: ${post_data.code}, please enter within 10 minutes to proceed. No OTP within 10 minutes? Request a new OTP with the USSC Super Service App`;
                    
          const sms_data = {
              "mobile_no": mobile_no,
              "sms" : sms,
              "pcode" : pcode
          };
          
          const sent = await this.send_sms(sms_data);

          if(sent == "SUCCESS") {
              msg = "Success";
              status = '1';
          } else {
              msg = "Message sending failed. Please try again later.";
          }

        }

      }else{

          msg = constants.OTP_TWO_MINUTES_MSG;

      }
      
      
    } else {

        msg = is_valid.msg;
    } 

    let response = {
      "message" : msg,
      "data" : post_data,
      "status" : status, 
    }

    return response;






    // const sms_data = {
    //   "mobile_no": '639465221959',
    //   "sms" : 'TEST OTP',
    //   "pcode" : ''
    // };

    // const sent = await this.send_sms(sms_data);

    // if(sent == "SUCCESS") {
    //     msg = "Success";
    //     status = '1';
    // } else {
    //     msg = "Message sending failed. Please try again later.";
    // }
    // let response = {
    //   "message" : msg,
    //   "data" : sent,
    //   "status" : '1', 
    // }

    // return response;

  } 

  verify = async (post_data) => {


    const mobile_no = post_data.mobile_no.trim();
    const user_id = post_data.user_id.trim();
    const code = (!post_data.code) ? "" : post_data.code;
    
    const is_valid = this.validate_data(post_data);
    let status = "0";
    let msg;

    if (is_valid.req_status == "1"){
      let otp_stats = await this.otp_model.get_status(user_id,mobile_no);

      if (otp_stats){
        let tries = await this.otp_model.add_no_tries(post_data);    

        if (tries >= 4){
            //LOCKED ACCOUNT
            // $this->call_locked_account($user_id,$mobile_no);
            msg = "You have exceeded the maximum limit of tries, your account has been locked.";
            
        } else {

            let is_expired = await this.otp_model.get_expiration(post_data);
                    
            if (is_expired){

              if (tries >= 3){
                // $this->call_locked_account($user_id,$mobile_no);
                  msg = "You have exceeded the maximum limit of tries, your account has been locked.";
              } else {
                  msg = `This OTP222 has already expired. Your account will be locked after 3 incorrect tries. \n Number of tries: ${tries}`;
              }

            }else{
              let verify_code = await this.otp_model.otp_verify(post_data);
              
              if (!verify_code) {

                  if (tries >= 3) {
                      // $this->call_locked_account($user_id,$mobile_no);
                      msg = "You have exceeded the maximum limit of tries, your account has been locked.";
                  } else {
                      msg = `The OTP you have entered is invalid. Your account will be locked after 3 incorrect tries. \n Number of tries: ${tries}`;
                  }
              } else {
                  await this.otp_model.reset_tries(post_data.user_id);
                  msg = "OTP Successfully Verified.";
                  status = '1';
              }
          }
          }
          
          
        } else{
            msg = "No Record Found.";
        }  


      } else{
        msg = is_valid.msg;
      }   

      let response = {
        "message" : msg,
        "data" : post_data,
        "status" : status, 
      }
      return response;  

    }


  get_expiration = async () => {
    const current_datetime = await this.otp_model.get_current_date_time();

    // generate expiration
    const date_time = new Date(current_datetime)
    date_time.setMinutes(date_time.getMinutes() + 10);
    const expiration = `${date_time.getFullYear()}-${("0" + (date_time.getMonth() + 1)).slice(-2)}-${("0" + date_time.getDate()).slice(-2)} ${date_time.getHours()}:${date_time.getMinutes()}:${date_time.getSeconds()}`
    return expiration;
    
  }


  validate_data = (post_data) => {
    const result = {}
    const user_id = post_data.user_id;
    const mobile_no = post_data.mobile_no;
    if (!user_id || user_id == ""){
        result['req_status'] = '0';
        result['msg'] = 'UserId is required.';
    } else if(!mobile_no || mobile_no == ""){
        result['req_status'] = '0';
        result['msg'] = 'Mobile number is required.';
    } else{
        result['req_status'] = '1';
        result['msg'] = 'Request is validated.';
    }
    return result;
  }


  send_sms = async (sms_data) => {

    const mobile_no = sms_data.mobile_no;
    const sms = sms_data.sms;
    const pcode = sms_data.pcode;
    const post_data = {
      "to" : sms_data.mobile_no,
      "text" : sms_data.sms
    }

    if(constants.SMS_LIBRARY == 'CSP'){
      logger("info", `Centrialize SMS Platform POST: ${JSON.stringify(sms_data)}`);
      const agent = new https.Agent({
          rejectUnauthorized: false,
      });

      const options = {
        method: 'POST',
        url: constants.CSP_URL,
        data: post_data,
        headers: {
          'content-type ': 'application/json',
          'Api-Key ' : constants.CSP_API_KEY
        },
        httpsAgent: agent
      };

      try {
        const response = await axios.request(options);
        logger('info', `Centrialize SMS Platform ACTUAL RESPONSE.... ${JSON.stringify(response.data)})`);

        if (response.data.status) {  
          const date_time = new Date()
          const date_in = `${date_time.getFullYear()}-${("0" + (date_time.getMonth() + 1)).slice(-2)}-${("0" + date_time.getDate()).slice(-2)} ${date_time.getHours()}:${date_time.getMinutes()}:${date_time.getSeconds()}`
              const objectResponse = {
                "from": "USSC",
                "pcode" : pcode,
                "msisdn" : mobile_no,
                "message" : sms,
                "datein" : date_in,
                "status" : parseInt(response.data.status),
                "status_msg" : (!response.data.results.body) ? '' : JSON.stringify(response.data.results.body),
                "sms_api" : (!response.data.sms_provider) ? '' : response.data.sms_provider,
                "csp_reference_no" : (!response.data.reference_no) ? '' : response.data.reference_no
              }
              await this.otp_model.insert_sms_out(objectResponse);
              if(response.data.status === 1){
                  return "SUCCESS";
              }
        }
        return 'FAILED';  
        
      } catch (error) {
        logger("info", `CSP API ERROR ${JSON.stringify(error)}`);
        
        return 'FAILED';
      }
    }

  }

  
}

module.exports = { Otp_api }