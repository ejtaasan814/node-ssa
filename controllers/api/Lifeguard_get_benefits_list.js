
const { ApiController } = require('../../services/ApiController')
const { Ussc_ws } = require('../../services/Ussc_ws')
const constants = require('../../config/constants')

class Lifeguard_get_benefits_list extends ApiController{
  constructor() {
    super()
    this.ussc_ws = new Ussc_ws()
  }

  index = async () => {

    let error_msg = "";

    if(!this.user_id){
         error_msg = "user_id is required. "; 
    }else if (!this.device_id) {
         error_msg = "device_id is required. "; 
    }

    if (error_msg != ""){
      return this.output_error(error_msg);
    }

    const response = [
      {
        "benefit" : "Accidental Death Benefit- P100,000",
        "description" : "Kapag namatay ang Insured sanhi ng aksidente ay makakakuha ang kanyang beneficiary ng P100,000.",
      },
      {
        "benefit" : "Murder or Unprovoked Assault- P100,000",
        "description" : "Kapag namatay ang Insured sanhi ng Murder or Unprovoked Assault ay makakakuha ang kanyang beneficiary ng P100,000",
      },
      {
        "benefit": "Burial Assistance (Tulong sa pagpapalibing)- P10,000",
        "description" :"Kapag namatay ang Insured sanhi ng aksidente o murder/ unprovoked assault ay makakakuha ng P10,000 ang kanyang beneficiary. Ito ay cash assistance at tulong sa pagpapalibing.",
      },
      {
        "benefit" : "Fire Cash Assistance - P5,000",
        "description" : "Kapag nasunugan ang Insured, makakakuha siya ng P5,000 cash assistance bilang tulong.",
      },
      {
        "benefit" : "Available for Lifeguard Plus P80 only Medical Reimbursement - P5,000",
        "description" : "Pwede mag reimburse ng accidental medical expenses hanggang P5,000, minimum of P500 only", 
      },
      {
        "benefit" : "Others",
        "description" : "Mayroon rin itong benepisyo kapag na-disable o may nadismember sa katawan ng insured (ang benepisyo ay magdedepende sa magiging case).",
      }
    ]
    
    return this.output_success('Success', response);
    
  }



}


module.exports = new Lifeguard_get_benefits_list();