// const { connection }  = require('../config/db.js')
const querydb  = require('../config/database.js');
const logger = require('../utils/logger.js');

class Otp_model {
  constructor () {

  }

  otp_add = async (post) => {

    try {
      let query = "SELECT status FROM `otp` WHERE mobile_no ="+"'"+ post.mobile_no+"'"+ "AND user_id ="+"'"+ post.user_id+"'";
      const result = await querydb(query);
      if(result.length > 0){
        try {
          let query = "UPDATE `otp` set user_id ="+"'" +post.user_id+ "'" + ", mobile_no ="+"'" +post.mobile_no+ "'" + ", code ="+"'" +post.code+ "'" + ", status ="+"'" +post.status+ "'" + ", expiration = "+"'" +post.expiration+ "'" + " WHERE mobile_no ="+"'"+ post.mobile_no+"'"+ "AND user_id ="+"'"+ post.user_id+"'";
          const result = await querydb(query);
        } catch (error) {
          logger("info", `ERROR ${JSON.stringify(error)}`);
        }
      }else{
        await this.add(post);
      }
      return true;
    } catch (error) {
      logger("info", `ERROR ${JSON.stringify(error)}`);
      return error;
    }
    

  }

  add = async (post) => {

    const post_data = {
      "user_id" : post.user_id,
      "mobile_no" : post.mobile_no,
      "code" : post.code,
      "status" : post.status,
      "expiration" : post.expiration
    }
    const post_values = Object.values(post_data)

    try {
      
      let query = "INSERT INTO `otp` (user_id, mobile_no, code, status, expiration) VALUES (?, ?, ?, ?, ?)";
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


  get_current_date_time = async () => {
      
    try {
      let query = "SELECT CURRENT_TIMESTAMP as date_time";
      const result = await querydb(query);
      if(result.length > 0){
        return result[0].date_time;
      }
      return
     
    } catch (error) {
      logger("info", `ERROR ${JSON.stringify(error)}`);
      return error;
    }

  }

  get_otp_code = async (post_data) => {
    let otp_code;
    try {
      let query = "SELECT code FROM `otp` WHERE mobile_no ="+"'"+ post_data.mobile_no+"'"+ "AND user_id ="+"'"+ post_data.user_id+"'"+"AND expiration >="+"'"+ await this.get_current_date_time()+"'";
      const result = await querydb(query);
      if(result.length > 0){
        otp_code = result[0].code;
      }else{
        otp_code = Math.floor(100000 + Math.random() * 900000);
      }
      return otp_code;
    } catch (error) {
      // throw { status: 500, message: error };
      return error;
    }
  }


  get_no_tries = async (post_data) => {
    
    try {
      let query = "SELECT no_of_tries FROM `otp` WHERE mobile_no ="+"'"+ post_data.mobile_no+"'"+ "AND user_id ="+"'"+ post_data.user_id+"'";
      const result = await querydb(query);
      let tries = 0;
      if(result.length > 0){
        tries = result[0].no_of_tries;
      }
      return tries;
    } catch (error) {
      // throw { status: 500, message: error };
      return error;
    }
  }


  get_time_interval = async (post_data) => {
    
    try {
      let query = "SELECT expiration FROM `otp` WHERE mobile_no ="+"'"+ post_data.mobile_no+"'"+ "AND user_id ="+"'"+ post_data.user_id+"'";
      const result = await querydb(query);
      let expiration = 0;
      let interval;
      let currdate;
      if(result.length > 0){
        expiration = new Date(result[0].expiration);
        let current_datetime = await this.get_current_date_time();
        currdate = new Date(current_datetime)
        currdate.setMinutes(currdate.getMinutes() + 10);
        
        interval = this.diff_date(expiration, currdate);
        if(interval.y == 0 && interval.m == 0 && interval.h == 0){
          if(interval.i <= 2){
            if(interval.i == 2 && interval.s >= 1){
              return true;
            }else{
                // "Please retry after two minutes";
                return false;
            }
          }
        }
      }
      return true;
      
    } catch (error) {
      logger("info", `ERROR ${JSON.stringify(error)}`);
      // return error;
      return 'ERROR';
    }
  }

  diff_minutes = (dt2, dt1) =>
  {

    var diff =(dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
    
  }

  diff_date = (dt2, dt1) => {
    // get total seconds between the times
    let delta = Math.abs(dt2 - dt1) / 1000;

    // calculate (and subtract) whole days
    let days = Math.floor(delta / 86400);
    delta -= days * 86400;

    // calculate (and subtract) whole hours
    let hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    // calculate (and subtract) whole minutes
    let minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    // what's left is seconds
    let seconds = delta % 60; 

    let months = Math.floor(days / 31);
    let years = Math.floor(months / 12);
    
    const response_date = {
      "y" : years,
      "m" : months,
      "d" : days,
      "h" : hours,
      "i" : minutes,
      "s" : seconds
    }
    return response_date;
  }

  get_otp_status = async (user_id) => {
    
    try {
      let query = "SELECT status FROM `otp` WHERE user_id ="+"'"+ user_id+"'";
      const result = await querydb(query);
      
      if(result.length > 0){
        return result[0].status;
      }else{
        return false;
      }
    } catch (error) {
      // throw { status: 500, message: error };
      return error;
    }
  }

  insert_sms_out = async (post) => {
    
    const post_data = {
      "from" : post.from,
      "msisdn" : post.msisdn,
      "message" : post.messages,
      "datein" : post.datein,
      "status" : parseInt(post.status),
      "status_msg" : post.status_msg,
      "pcode" : post.pcode,
      "sms_api" : post.sms_api,
      "csp_reference_no" : post.csp_reference_no
    }
    const post_values = Object.values(post_data)
    
    try {
      
      let query = "INSERT INTO `sms_out` (`from`, `msisdn`, `message`, `datein`, `status`, `status_msg`, `pcode`, `sms_api`, `csp_reference_no`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
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

  get_status = async (user_id, mobile_no) => {
    
    try {
      let query = "SELECT status FROM `otp` WHERE user_id ="+"'"+ user_id+"'" + "AND mobile_no ="+"'"+ mobile_no+"'";
      const result = await querydb(query);
      
      if(result.length > 0){
        return result[0].status;
      }else{
        return false;
      }
    } catch (error) {
      // throw { status: 500, message: error };
      return error;
    }
  }



  add_no_tries = async (post) => {

    try {
      let query = "SELECT no_of_tries FROM `otp` WHERE mobile_no ="+"'"+ post.mobile_no+"'"+ "AND user_id ="+"'"+ post.user_id+"'";
      const result = await querydb(query);

      if(result.length > 0){
        let tries = result[0].no_of_tries;
        tries += 1;

        if(tries <= 3){
          try {
            let query = "UPDATE `otp` set no_of_tries ="+"'" +tries+ "'" + " WHERE mobile_no ="+"'"+ post.mobile_no+"'"+ "AND user_id ="+"'"+ post.user_id+"'";
            const result = await querydb(query);
          } catch (error) {
            logger("info", `ERROR ${JSON.stringify(error)}`);
          }
        }
        return tries;
      }
      return false;
    } catch (error) {
      logger("info", `ERROR ${JSON.stringify(error)}`);
      return error;
    }
  
  }


  get_expiration = async (post_data) => {
    try {
      let query = "SELECT status FROM `otp` WHERE mobile_no ="+"'"+ post_data.mobile_no+"'"+ " AND user_id ="+"'"+ post_data.user_id+"'"+" AND expiration <"+"'"+ await this.get_current_date_time()+"'" + " AND code ="+"'"+ post_data.code+"'";
      const result = await querydb(query);
      if(result.length > 0){
        return true;
      }
      return false;
    } catch (error) {
      logger("info", `ERROR ${JSON.stringify(error)}`);
      return error;
    }
  }


  otp_verify = async (post_data) => {
    try {
      let query = "SELECT status FROM `otp` WHERE mobile_no ="+"'"+ post_data.mobile_no+"'"+ " AND user_id ="+"'"+ post_data.user_id+"'"+" AND expiration >="+"'"+ await this.get_current_date_time()+"'" + " AND code ="+"'"+ post_data.code+"'";
      const result = await querydb(query);
      if(result.length > 0){

        let otp_stats = result[0].status;
        let status;
        if(otp_stats == "0"){
          status['status'] = '1';

        }else{
          status['status'] = '2';
        }

        status['no_of_tries'] = '0';
        status['code'] = Math.floor(100000 + Math.random() * 900000);
        try {
          let query = "UPDATE `otp` set no_of_tries ="+"'" +status.no_of_tries+ "'"+ ",status ="+"'" +status.status+ "'" + " WHERE mobile_no ="+"'"+ post.mobile_no+"'"+ "AND user_id ="+"'"+ post.user_id+"'" + "AND code ="+"'"+ post.code+"'";
          const result = await querydb(query);
          if(result.affectedRows){
            return true;
          }
        } catch (error) {
          logger("info", `ERROR ${JSON.stringify(error)}`);
        }
      }
      return false;
    } catch (error) {
      // logger("info", `ERROR3 ${JSON.stringify(error)}`);
      return error;
    }
  }

  reset_tries = async (user_id) => {
    let data = {};
    data.no_of_tries = "0";

    try {
      let query = "UPDATE `otp` set no_of_tries ="+"'" +data.no_of_tries+ "'" + " WHERE user_id ="+"'"+ user_id+"'";
      const result = await querydb(query);
      if(result.affectedRows){
        return true;
      }else{
        try {
          let query = "SELECT id FROM `otp` WHERE user_id ="+"'"+ user_id+"'";
          const result = await querydb(query);
          if(result.length > 0){
            return true;
          }else{
            return false;
          }
        } catch (error) {
          logger("info", `ERROR ${JSON.stringify(error)}`);
          return error;
        }
    } 
    } catch (error) {
      logger("info", `ERROR ${JSON.stringify(error)}`);
    }
  }

  // public function reset_tries($user_id){
  //   $data['no_of_tries'] = '0';
  //   $this->db->where('user_id', $user_id);
  //   $this->db->update($this->table, $data);
  //   $update = $this->db->affected_rows();

  //   if($update){
  //        return TRUE;
  //   }else{
  //       $this->db->select('id');
  //       $this->db->from($this->table);
  //       $this->db->where('user_id', $user_id);
  //       $result = $this->db->get();
  //       if($result->num_rows() > 0){
  //           return TRUE;
  //       }else{
  //           return FALSE;
  //       }
  //   }
// }



}

module.exports = { Otp_model }