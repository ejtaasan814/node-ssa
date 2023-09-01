const logger = require('./logger');
const db  = require('../config/database.js');

const db_logger = async (data) => {

  const date_time = new Date()
  const current_date = `${date_time.getFullYear()}-${("0" + (date_time.getMonth() + 1)).slice(-2)}-${("0" + date_time.getDate()).slice(-2)}`
  const current_time = `${date_time.getHours()}:${date_time.getMinutes()}:${date_time.getSeconds()}`
  data.current_date = current_date
  data.current_time = current_time
  const post_values = Object.values(data)
  try {
    let query = "INSERT INTO `api_logs` (user_id, session_id, trace_no, mobile_post, web_service_post, web_service_response, api_url, create_date, create_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    // let query = "INSERT INTO `mobile_session` (class, method, platform, version, device_id, request_id, session_id, users_id, device_signature, ip_address, current_coordinates, os_version, hardware_version, expiration) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const result = await db(query, post_values);
    logger('info', `CUSTOM DB LOG UMSI ${JSON.stringify(data)}`)
    if(result){
      return
    }
    return
  } catch (error) {
    // throw { status: 500, message: error };
    return error;
  }
}


module.exports = db_logger