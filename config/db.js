const mysql = require('mysql')

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root123@',
  database: 'node_ssa'
})

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
 
  console.log('DATABASE CONNECTED - ID ' + connection.threadId);
});

module.exports = { connection }

