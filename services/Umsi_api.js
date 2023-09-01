const axios = require('axios');
const logger = require('../utils/logger');
const db_logger = require('../utils/db_logger');
const https = require('https');
const constants = require('../config/constants');

class Umsi_api {
  
  constructor (gi) {
    this.global_obj = gi;
  }
  
  moneygram_get_codes = async (post_data) =>{
    const url = constants.UMSI_MONEYGRAM_BASE_URL + constants.UMSI_MONEYGRAM_GET_CODES;

    const key = constants.UMSI_MONEYGRAM_API_KEY;

    const result = this.send_request(url, post_data, key);

    return result;
  }

  send_request = async (url, post_data, key) => {

    logger('info', `UMSI URL: ${url}`);
    logger('info', `UMSI ACTUAL POST.... ${JSON.stringify(post_data)}`);

    const agent = new https.Agent({
        rejectUnauthorized: false,
    });

    const options = {
      method: 'POST',
      url: url,
      data: post_data,
      headers: {
        'content-type ': 'application/json',
        'apikey ' : key
      },
      httpsAgent: agent
    };

    try {
      const response = await axios.request(options);
      logger('info', 'UMSI WEB SERVICE RESPONSE');
      logger('info', `UMSI ACTUAL RESPONSE.... ${JSON.stringify(response.data)})`);

      this.custom_log(post_data, response.data, url)

      response.data.status = true;
      return response.data
      
    } catch (error) {
      logger("info", `UMSI API ERROR ${JSON.stringify(error)}`);

      const err = {
        "err_message": error,
        "status" : false
      }
      
      return err
    }
  }

  custom_log = async (web_post, web_res, url) => {
    const log_data = {
      "user_id" : this.global_obj.user_id,
      "session_id" : this.global_obj.session_id,
      "trace_no" : "",
      "mobile_post" : this.global_obj.request.body,
      "web_service_post" : JSON.stringify(web_post),
      "web_service_response" : JSON.stringify(web_res),
      "api_url" : url
    };

    db_logger(log_data);
    return;
  }

  
}

module.exports = { Umsi_api }