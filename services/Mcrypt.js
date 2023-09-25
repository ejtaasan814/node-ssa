const Rijndael = require("rijndael-js");
const padder = require('pkcs7-padding');
const crypto = require('crypto');
const constants = require('../config/constants');
const logger = require('../utils/logger');

class Mcrypt{

  key = 'CmA1Lcl3arM1nD!1';
  iv = '1!Dn1Mar3lcL1AmC';
  mycrpyt_key = 'u$$cp@n@10w@113t';
  mycrpyt_iv = 'p@na10W@113t';

  my_encrypt = async (str) => {

    const key = crypto.createHash('sha256').update(this.mycrpyt_key).digest('hex')
    const iv = crypto.createHash('sha256').update(this.mycrpyt_iv).digest('hex');

    const cipher = crypto.createCipheriv('aes-256-cbc', key.substring(0,32), iv.substring(0,16));
    let encrypted = cipher.update(str, 'utf8', 'base64'); // 1st Base64 encoding
    encrypted += cipher.final('base64'); 
    return Buffer.from(encrypted, 'utf8').toString('base64'); // 2nd Base64 encoding

  }

  my_decrypt = async (str) => {

    const key = crypto.createHash('sha256').update(this.mycrpyt_key).digest('hex')
    const iv = crypto.createHash('sha256').update(this.mycrpyt_iv).digest('hex');

    const decoded_str = Buffer.from(str, 'base64').toString('utf8'); // 1st Base64 decoding
    const decipher = crypto.createDecipheriv('aes-256-cbc', key.substring(0,32), iv.substring(0,16));
    let decrypted = decipher.update(decoded_str, 'base64', 'utf8'); // 2nd Base64 decoding
    return decrypted + decipher.final('utf8'); 

  }
  
  encrypt = (str) => {
 
    // Plaintext will be zero-padded
    // const original = '152015036';
    
    const cipher = new Rijndael(this.key, 'cbc', '');
    const padded = padder.pad(str, 16); //Use 16 = 128 bits block sizes
    const ciphertext = Buffer.from(cipher.encrypt(padded, 128, this.iv));

    const binary = ciphertext.toString('binary');
    logger('info', this.bin2hex(binary));
    // res.send(this.bin2hex(binary));
    return this.bin2hex(binary);

  }

  decrypt = async (encrypted) => {
 
    try{
      const hex = this.hex2bin(encrypted);
  
      var original_data = Buffer.from(hex, 'binary');
      
      const cipher = new Rijndael(this.key, 'cbc', '');
      
      const decrypted = Buffer.from(cipher.decrypt(original_data, 128, this.iv));
      var string_dec_val = Buffer.from(padder.unpad(decrypted), 'utf-8').toString()
      
      return string_dec_val;
    }catch (error){
      return '';
    }
   
  }


  hex2bin = (hex) => {
    var bytes = [], hex;

    for(var i=0; i< hex.length-1; i+=2)
        bytes.push(parseInt(hex.substr(i, 2), 16));

    return String.fromCharCode.apply(String, bytes);    
  }

  bin2hex = (s) =>
  {
    let i
    let l
    let o = ''
    let n
    s += ''
    for (i = 0, l = s.length; i < l; i++) {
      n = s.charCodeAt(i)
        .toString(16)
      o += n.length < 2 ? '0' + n : n
    }
    return o   
  }


  

}

module.exports = { Mcrypt }