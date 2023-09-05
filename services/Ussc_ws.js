const axios = require('axios');
const https = require('https');
const constants = require('../config/constants');
const logger = require('../utils/logger');

class Ussc_ws{

  lifeguard_get_types = async () => {

    const url = constants.USSC_SERVER + constants.USSC_LIFEGUARD_GET_TYPES;

    const result = await this.send_request_get(url)
    return result;

  }

  lifeguard_get_beneficiaries = async () => {

    const url = constants.USSC_SERVER + constants.USSC_LIFEGUARD_GET_BENEFICIARIES;

    const result = await this.send_request_get(url)
    return result;

  }

  lifeguard_fee_inquiry = async () => {

    const url = constants.USSC_SERVER + constants.USSC_LIFEGUARD_FEE_INQUIRY;

    const result = await this.send_request_get(url)
    return result;

  }

  lifeguard_get_policies = async (post_data) => {

    const url = constants.USSC_SERVER + constants.USSC_LIFEGUARD_GET_POLICIES;

    const result = await this.send_request(url, post_data)
    return result;
}

  hospiguard_get_options = async (post_data) => {

    const url = constants.USSC_SERVER + constants.HOSPIGUARD_GET_OPTIONS;

    const result = await this.send_request(url, post_data)
    return result;
  }

  hospiguard_transaction_inquiry = async (post_data) => {

    const url = constants.USSC_SERVER + constants.HOSPIGUARD_TRANSACTION_INQUIRY;

    const result = await this.send_request(url, post_data)
    return result;
  }

  hospiguard_post_transaction = async (post_data) => {

    const url = constants.USSC_SERVER + constants.HOSPIGUARD_POST_TRANSACTION;

    const result = await this.send_request(url, post_data)
    return result;
  }

  notification_get_all = async (post_data) => {
    const url = constants.USSC_SERVER + constants.USSC_NOTIFICATION_ALL;

    const result = await this.send_request(url, post_data)
    return result;
  }

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
      const errorMessage = error.message ? error.message : "";
      logger('info', `ACTUAL ERROR.... ${JSON.stringify(error)})`);
      logger('info', 'USSC ERROR WEB SERVICE RESPONSE');
      logger('info', `ACTUAL ERROR RESPONSE.... ${JSON.stringify(errorMessage)})`);
      
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


  send_request_get_file = async (file, platform) => {

    const url = constants.USSC_SERVER + constants.USSC_LIFEGUARD_GET_FILE + file;
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

      if (response.code) {  
        logger('info', 'GET FILE ERROR RESPONSE....');
        logger('info', JSON.stringify(response.data));
        if(response.code == "ER0404"){
            const objectResponse = {
              success: false,
              code : 200,
              name : "OK",
              data : {},
              error: {
                msg: 'Not found'
              }
            }
            return objectResponse
        }
      }
      
      return response.data;
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


  send_request_file = async (file_url, file, platform) => {

    const url = file_url;
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

      if (response.code) {  
        logger('info', 'GET FILE ERROR RESPONSE....');
        logger('info', JSON.stringify(response.data));
        if(response.code == "ER0404"){
            const objectResponse = {
              success: false,
              code : 200,
              name : "OK",
              data : {},
              error: {
                msg: 'Not found'
              }
            }
            return objectResponse
        }
      }
      
      return response.data;
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