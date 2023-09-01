const mysql = require('mysql');
const mariadb = require('mariadb');
const logger = require('../utils/logger.js');

const development_db = 
  {
    host     : 'mariadb',
    user     : 'root',
    password : 'root',
    database : 'node_ssa',
    dateStrings: true
  }

  
  const active_config = development_db

  // var connection = mysql.createConnection(active_config);
  // connection.connect((err) => {
  //     if(!err){
  //         console.log('DB Connected');
  //     }else{
  //         console.log(err);
  //     }
  //   })

  // connect()
  // async function connect() {
  //   try {
  //       await pool.getConnection();
  //   } catch (err) {
  //       console.log(err);
  //   }
  // }

  //WORKING LOCAL DB
  // let pool  = mysql.createPool(active_config);
  // const querydb = async (query, post='') => {

  //   return new Promise((resolve,reject) => {

  //     pool.query(query, post, function (error, results) {
  //       if (error){
  //         logger('info', JSON.stringify(error))
  //         reject(error)
  //       }else{
  //         resolve(results);
  //       }
  //     });

  //   })
  // }

  
  let pool  = mariadb.createPool(active_config);
  const querydb = async (query, post='') => {
    
    let conn;
    try {
        conn = await pool.getConnection();
        // logger("info", "mariadb db connected");
        const rows = await conn.query(query, post);
        // logger("info", `DATABASE RESULT ${JSON.stringify(rows)}`);
        return rows;
    } catch (err) {
        if(err != ""){
          // logger("info", `DATABASE ERROR! ${JSON.stringify(err)}`)
        }
        throw err;
    } finally {
      if (conn) conn.release(); //release to pool
    }
  }

  // async function querydb () {
  //   return new Promise(function(resolve,reject){
  //     pool.getConnection().then(function(connection){
  //       logger("info", "mariadb db connected");
  //       resolve(connection);
  //     }).catch(function(error){
  //       logger("info", "ERRROR!");
  //       logger("info", JSON.stringify(error));
  //       reject(error);
  //     });
  //   });
  // }

  // const connection = mariadb.createConnection({
  //     host: '127.0.0.1',
  //     user: 'someuser',
  //     password: 'somepassword',
  //     database: 'dashboard',
  //     port: '3306',
  // }).then(conn => {
  //     console.log('connection established.');
  // }).catch(err => {
  //     console.log(err);
  // });

  module.exports = querydb;