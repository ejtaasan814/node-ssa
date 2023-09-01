const { ApiController } = require('../ApiController')

class Tester extends ApiController {
  // constructor() {
  //   super()
  //   this.ussc_ws = new Ussc_ws()
  // }

  index = async () => {

    this.response.send(this.request.originalUrl)
  }

}


module.exports = new Tester()