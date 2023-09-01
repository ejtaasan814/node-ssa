const { ApiController } = require('./ApiController')
const { Mobile_session } = require('../../models/Mobile_session');
const logger = require('../../utils/logger');

class Tester extends ApiController{
  // constructor() {
  //   super()
  //   this.ussc_ws = new Ussc_ws()
  // }
  // constructor() {
  //   this.mobile_session_model = new Mobile_session()
  // }

  // remap = async (req, res) => {

  //   let session_data = {
  //     "class" : "test_class",
  //     "method" : "test_method",
  //     "platform" : "this_platform",
  //     "version" : "this_version",
  //     "device_id" : "this_device_id",
  //     "request_id" : "this_request_id",
  //     "session_id" : "this_new_session_id",
  //     "users_id" : "this_user_id",
  //     "device_signature" : "this_signature",
  //     "ip_address" : "this_ip_address",
  //     "expiration" : "expiration",
  //     "current_coordinates" : "this_current_coordinates",
  //     "os_version" : "this_os_version",
  //     "hardware_version" : "this_hardware_version"
  //   }

  //   this.mobile_session_model.add(session_data)

  //   res.send('HEY')
  // }

  index = async () => {
    // let response =  await this.uss c_ws.notification_get_all()
    // console.log(response)
    
    // res.send(this.output_success('Success', req.body))

    // res.send('Notification index')

    this.output_success('TEST ME! baby')
  }

  test_me = (req, res) => {
    this.output_success('TEST ME! baby')
  }



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