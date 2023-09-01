var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
const routesPath = path.join(__dirname, '../controllers/api');

// router.post('/notification_get_all',
// validate([
//   body('user_id').notEmpty().withMessage('user_id required'),
//   body('device_id').notEmpty().withMessage('device_id is required'),
//   body('version').notEmpty().withMessage('version is required'),
//   body('platform').notEmpty().withMessage('platform is required')
// ]),
// notificationController.remap
// );


// Recursive function to get files
function getFiles(dir, files = []) {
  // Get an array of all files and directories in the passed directory using fs.readdirSync
  const fileList = fs.readdirSync(dir);
  // Create the full path of the file/directory by concatenating the passed directory and file/directory name
  for (const file of fileList) {
    if(file[0] != "."){
      
      const name = `${dir}/${file}`;

      //explode controller path and remove the value 'controllers/api'
      const controller_path = name.split('/');
      controller_path.splice(0, 2);
      const final_path = controller_path.join("/")

      // Check if the current file/directory is a directory using fs.statSync
      if (fs.statSync(name).isDirectory()) {
        // If it is a directory, recursively call the getFiles function with the directory path and the files array
        getFiles(name, files);
      } else {

        // explode controller path and remove controller's extension
        // If it is a file, push the modified controller name

        // controller directory array
        const controller_dir = final_path.split('/');
        // get the last element of array as controller file and split to remove extension
        const get_controller_file = controller_dir.pop();
        const controller_file = get_controller_file.split('.');
        const controller = controller_file[0];

        //Check if controller_dir does not have directory
        let controller_path = ''
        if(controller_dir.length == 0){
          controller_path = controller;
        }else{
          controller_path = `${controller_dir.join("/")}/${controller}`;
        }
        
        files.push(controller_path);
      }
    }
  }
  
  return files;
}

const files = getFiles('controllers')


router.get('/web/agreements/Terms_and_conditions/:service?',
(req, res) => {
  const terms_and_conditions = require("../controllers/api/web/agreements/Terms_and_conditions")
  terms_and_conditions.remap(req, res)
});


files.forEach((file) => {
    router.all(`/${file}/:method?`,
    (req, res) => {
      const controller = require("../controllers/api/"+file)
      controller.remap(req, res)
    });
})




// router.post('/test_mysql', tester.index);

module.exports = router;
