const axios = require('axios');
const https = require('https');
const constants = require('../config/constants');
const logger = require('../utils/logger');

class Ussc_ws{

  get_access_token = async () => {

    const agent = new https.Agent({
        rejectUnauthorized: false,
    });

    const post_data = {
      'grant_type' : 'client_credentials',
      'client_id' : constants.USSC_OAUTH_CLIENT_ID,
      'client_secret' : constants.USSC_OAUTH_CLIENT_SECRET
    }

    const options = {
      method: 'POST',
      url: constants.USSC_OAUTH_TOKEN_URL,
      data: post_data,
      headers: {
        'content-type': 'application/json'
      },
      httpsAgent: agent
    };

    try {
      const response = await axios.request(options);
      console.log(response.data)
      return response.data
    } catch (error) {
      console.error(error);
      return error
    }
  }


  lifeguard_fee_inquiry = async () => {

    const url = constants.USSC_SERVER + constants.USSC_LIFEGUARD_FEE_INQUIRY;

    const result = await this.send_request_get(url)
    return result;

  }

  notification_get_all = async (post_data) => {
    const url = constants.USSC_SERVER + constants.USSC_NOTIFICATION_ALL;

    const result = await this.send_request(url, post_data)
    return result;
  }



  send_request = async (url, post_data) => {
    
    if(constants.ENVIRONMENT == 'development'){
      logger('info', `URL: ${url}`);
      logger('info', 'ACTUAL POST....');
      logger('info', JSON.stringify(post_data));    
    }

    const token = await this.get_access_token()
    const token_type = token.token_type ? token.token_type : ""
    const access_token = token.access_token ? token.access_token : ""

    const agent = new https.Agent({
        rejectUnauthorized: false,
    });

    const options = {
      method: 'POST',
      url: url,
      data: post_data,
      headers: {
        'content-type ': 'application/json',
        'Authorization ': token_type + " " + access_token
      },
      httpsAgent: agent
    };

    try {
      const response = await axios.request(options);
      logger('info', 'USSC WEB SERVICE RESPONSE');
      logger('info', `ACTUAL RESPONSE.... ${JSON.stringify(response.data)})`);

      if (response.status) {  

        if(response.status == 500) {   
            const objectResponse = {
              success: false,
              code : 200,
              name : "OK",
              data : {},
              error: {
                msg: constants.NO_RESPONSE_MSG
              }
            }
          return objectResponse
        }   
      }
      
      if (!response.data) {
        const objectResponse = {
          success: false,
          code : 200,
          name : "OK",
          data : {},
          error: {
            msg: constants.NO_RESPONSE_MSG
          }
        }
        return objectResponse
      } else {
          response.data.success = true;
          return response.data;
      }
      
    } catch (error) {
      console.log(error);
      
      const objectResponse = {
        success: false,
        code : 200,
        name : "OK",
        data : {},
        error: {
          msg: constants.NO_RESPONSE_MSG
        }
      }
      return objectResponse
    }

  }



  send_request_get = async (url) => {
    
    if(constants.ENVIRONMENT == 'development'){
      logger('info', `URL: ${url}`);
    }

    const token = await this.get_access_token()
    const token_type = token.token_type ? token.token_type : ""
    const access_token = token.access_token ? token.access_token : ""

    const agent = new https.Agent({
        rejectUnauthorized: false,
    });

    const options = {
      method: 'GET',
      url: url,
      headers: {
        'content-type ': 'application/json',
        'Authorization ': token_type + " " + access_token
      },
      httpsAgent: agent
    };

    try {
      const response = await axios.request(options);
      logger('info', 'USSC WEB SERVICE RESPONSE');
      logger('info', `ACTUAL RESPONSE.... ${JSON.stringify(response.data)})`);

      if (response.status) {  

        if(response.status === 500) {   
            const objectResponse = {
              success: false,
              code : 200,
              name : "OK",
              data : {},
              error: {
                msg: constants.NO_RESPONSE_MSG
              }
            }
          return objectResponse
        }   
      }
      
      if (!response.data) {
        const objectResponse = {
          success: false,
          code : 200,
          name : "OK",
          data : {},
          error: {
            msg: constants.NO_RESPONSE_MSG
          }
        }
        return objectResponse
      } else {
          response.data.success = true;
          return response.data;
      }
      
    } catch (error) {
      console.log(error);
      
      const objectResponse = {
        success: false,
        code : 200,
        name : "OK",
        data : {},
        error: {
          msg: constants.NO_RESPONSE_MSG
        }
      }
      return objectResponse
    }

  }


}

module.exports = { Ussc_ws }