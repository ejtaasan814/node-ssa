const { ApiController } = require('../../services/ApiController')
const { Mobile_session } = require('../../models/Mobile_session');
const logger = require('../../utils/logger');
const Rijndael = require("rijndael-js");
const padder = require('pkcs7-padding');
const crypto = require('crypto');
const { Mcrypt } = require('../../services/Mcrypt')


class Tester{

  constructor () {
    this.mcrypt = new Mcrypt()
  }

  key = 'CmA1Lcl3arM1nD!1';
  iv = '1!Dn1Mar3lcL1AmC';

  remap = async (req, res) => {

    // const dec = this.mcrypt.encrypt('152015232');
    const dec = await this.mcrypt.decrypt('d0ab39685904983dddd7d97d12b85a90');
    // const dec = await this.mcrypt.my_encrypt('0152015036001');
    // const dec = await this.mcrypt.my_decrypt('OVVjVlczK1R2d1dOQkJGZzA2RnplZz09');

    res.send(dec);

  }


  decrypt = async (req, res) => {
 
    try{
      const encrypted = '7b468c21a41519088ea4bfa2d0482cd4';
      const hex = this.hex2bin(encrypted);
  
      var original_data = Buffer.from(hex, 'binary');
      
      const cipher = new Rijndael(this.key, 'cbc', '');
      
      const decrypted = Buffer.from(cipher.decrypt(original_data, 128, this.iv));
      var string_dec_val = Buffer.from(padder.unpad(decrypted), 'utf-8').toString()
      
      res.send(string_dec_val);
    }catch (error){
      res.send('none');
    }
   
  }
  
  encrypt = async (req, res) => {
 
    // Plaintext will be zero-padded
    const original = '152015036';
    
    const cipher = new Rijndael(this.key, 'cbc', '');
    const padded = padder.pad(original, 16); //Use 16 = 128 bits block sizes
    const ciphertext = Buffer.from(cipher.encrypt(padded, 128, this.iv));

    const binary = ciphertext.toString('binary');
    
    res.send(this.bin2hex(binary));

  }



  remap1 = async (req, res) => {

    // private $iv = '1!Dn1Mar3lcL1AmC'; 
    // private $key = 'CmA1Lcl3arM1nD!1'; 
    // private $mycrpyt_key = 'u$$cp@n@10w@113t';
    // private $mycrpyt_iv = 'p@na10W@113t';
    // public $CI;
    // function encrypt($str) {

    //   //$key = $this->hex2bin($key);    
    //   $iv = $this->iv;

    //   $td = @mcrypt_module_open('rijndael-128', '', 'cbc', $iv);

    //   @mcrypt_generic_init($td, $this->key, $iv);

    //   if (strtolower($this->CI->platform) == 'ios' || $this->CI->version >= 3.0) {
    //       $size = @mcrypt_get_block_size(MCRYPT_RIJNDAEL_128, MCRYPT_MODE_ECB); 
    //       $encrypted = @mcrypt_generic($td, $this->pkcs5_pad($str,$size));
    //   }else{
    //       $encrypted = @mcrypt_generic($td, $str);
    //   }
    //   @mcrypt_generic_deinit($td);
    //   @mcrypt_module_close($td);

    //   return bin2hex($encrypted);

    // }

    const key = 'CmA1Lcl3arM1nD!1';
    const iv = '1!Dn1Mar3lcL1AmC';
 
    // Plaintext will be zero-padded
    const original = '152015232';
    
    const cipher = new Rijndael(key, 'cbc', '');
    const padded = padder.pad(original, 16); //Use 32 = 256 bits block sizes
    const ciphertext = Buffer.from(cipher.encrypt(padded, 128, iv));
    const plaintext = Buffer.from(cipher.decrypt(ciphertext, 256, iv));

    const binary = ciphertext.toString('binary');
    
    res.send(this.bin2hex(binary));

    // ciphertext.toString("base64");
      
    // const plaintext = Buffer.from(cipher.decrypt(ciphertext, '', iv));

    // if (original === plaintext.toString()){
    //   res.send('true') 
    // }else{
    //   res.send(ciphertext.toString("base64"));
    // }

    
    //-----


    // const plainText = Buffer.from('152015036', 'utf8');
    // //Pad plaintext before encryption
    // // Key can be 16/24/32 bytes long (128/192/256 bit)
    // const padded = padder.pad(plainText, 16); //Use 32 = 256 bits block sizes
    // const key = 'CmA1Lcl3arM1nD!1';
    // const iv = '1!Dn1Mar3lcL1AmC';
    

    // const cipher = new Rijndael(key, 'cbc'); //CBC mode
    // const encrypted = Buffer.from(cipher.encrypt(padded, 128, iv));

    // res.send(hex2bin(ciphertext.toString()));
    

    // const bintohex = yourNumber.toString(16);
   
    
  }

   hex2bin = (hex) => {
    var bytes = [], str;

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

  // index = async () => {
  //   // let response =  await this.uss c_ws.notification_get_all()
  //   // console.log(response)
    
  //   // res.send(this.output_success('Success', req.body))

  //   // res.send('Notification index')

  //   this.output_success('TEST ME! baby')
  // }

  // test_me = (req, res) => {
  //   this.output_success('TEST ME! baby')
  // }



//   public function log_data_function_umsi($post_data = false,$response = false, $url = false){
//     // $directory = isset($this->CI->router->directory) ? $this->CI->router->directory : "";
//     $log_data = array(
//                      'user_id' => $this->CI->user_id,
//                      'session_id' => $this->CI->session_id,
//                      'trace_no' => $this->CI->trace_no,
//                      'mobile_post' => json_encode($_POST),
//                      'web_service_post' =>  $post_data,
//                      'web_service_response' =>  json_encode($response),
//                      'api_url' =>  $url
//                      );

//     return $log_data;
// }   

}


module.exports = new Tester()