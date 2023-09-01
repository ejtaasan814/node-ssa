const db  = require('../config/database.js');
const winston = require('winston');
const { combine, timestamp, printf } = winston.format;
require('winston-daily-rotate-file');

const save_db = async (post) => {
  const post_values = Object.values(post)
  try {
    let query = "INSERT INTO `api_logs` (user_id, session_id, trace_no, mobile_post, web_service_post, web_service_response, api_url, create_date, create_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const result = await db(query, post_values);
    if(result){
      return
    }
    return
  } catch (error) {
    // throw { status: 500, message: error };
    return error;
  }
}


const logger = (log_level, log_message) => {
  if(log_level == 'db'){
    save_db(log_message);
    log_level = 'info';
  }
  const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
  });

  var transport = new winston.transports.DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD'
  });
  
  const logger = winston.createLogger({
    format: combine(
      // label({ label: 'right meow!' }),
      timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      myFormat
    ),
    // transports: [new transports.Console(), new transports.File({ filename: 'combined.log' })]
    transports: [
      transport
    ]
  });
  logger.log(log_level,log_message)
}



module.exports = logger