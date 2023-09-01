// const { connection }  = require('../config/db.js')
const querydb  = require('../config/database.js');
const logger = require('../utils/logger.js');

class Mobile_session {
  constructor () {

  }

  // add = async (post) => {
  //   var query = await connection.query('INSERT INTO mobile_session SET ?', post, function (error, results, fields) {
  //     if (error) throw error;
  //   });
  //   console.log(query.sql);
  // }

  add = async (post) => {
    const post_values = Object.values(post)
    const post_columns = Object.keys(post)
    // const post_values = ["Tester","POST","","3.0.35","","","d287c32d-b7f3-4c44-b5c5-2ddf00b26f6a","","","","","","","2023-09-02 5:40:34"];
    // logger("info", `POST DB ${JSON.stringify(post_values)}`)
    try {
      // let query = "INSERT INTO `mobile_session` (class, method, platform, version, device_id, request_id, session_id, users_id, device_signature, ip_address, current_coordinates, os_version, hardware_version, expiration) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )";
      let query = "INSERT INTO `mobile_session` (class, method, platform, version, device_id, request_id, session_id, users_id, device_signature, ip_address, current_coordinates, os_version, hardware_version, expiration) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      const result = await querydb(query, post_values);
      if(result)
      {
        return
      }
      return
    } catch (error) {
      logger("info", `ERROR ${JSON.stringify(error)}`);
      return error;
    }

  }
  

  is_session_id_exist = async (session_id) => {
    try {
      let query = "SELECT * FROM `mobile_session` WHERE session_id ="+"'"+ session_id+"'";
      const result = await querydb(query);
      if(result.length > 0){
        return true
      }
      return false;
    } catch (error) {
      // throw { status: 500, message: error };
      return false;
      // return error;
    }
  }

  get_record = async (session_id) => {
    try {
      let query = "SELECT * FROM `mobile_session` WHERE session_id ="+"'"+ session_id+"' LIMIT 1";
      const result = await querydb(query);
      if(result.length > 0){
        return result
      }
      return result;
    } catch (error) {
      // throw { status: 500, message: error };
      return error;
    }
  }

  is_request_id_exist = async (request_id) => {
    try {
      let query = "SELECT * FROM `mobile_session` WHERE request_id ="+"'"+ request_id+"'";
      const result = await querydb(query);
      if(result.length > 0){
        return true
      }
      return false;
    } catch (error) {
      // throw { status: 500, message: error };
      return error;
    }
  }


  test_mobile = async () => {
  
  }

}

module.exports = { Mobile_session }