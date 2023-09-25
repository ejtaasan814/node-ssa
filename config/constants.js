const constants = {
  ENVIRONMENT: 'development',
  
  BPI_BRANCH_CODE : '61300',
  UMSI_USERID : 'MAP001',

  CHANNEL_KIOSK : 'K',
  CHANNEL_WEB : 'O',
  CHANNEL_MOBILE : 'M',
  CHANNEL_MERCHANT : 'E',
  CHANNEL_MERCHANT_DSWD : 'D',

  ANDROID_VERSION : '1.031',// prod = 1.031  dev = 1.031.001
  IOS_VERSION : '1.0.09',

  FORCE_UPDATE_ANDROID : '3.0.30',
  FORCE_UPDATE_IOS :  '3.0.30',

  USSC_SERVER: 'https://192.168.205.127:1328',
  
  USSC_NOTIFICATION_ALL: '/Notification/getActive',
  USSC_NOTIFICATION_GET_DETAILS: '/Notification/getDetails',
  
  
  //LIFEGUARD
  USSC_LIFEGUARD_FEE_INQUIRY : '/LifeGuard/feeInquiry',
  USSC_LIFEGUARD_GET_BENEFICIARIES : '/LifeGuard/getBeneficiaries',
  USSC_LIFEGUARD_GET_TYPES : '/LifeGuard/getTypes',
  USSC_LIFEGUARD_GET_FILE : '/LifeGuard/getFile/',
  USSC_LIFEGUARD_GET_POLICIES : '/LifeGuard/myPolicies',

  //HOSPIGUARD
  HOSPIGUARD_GET_OPTIONS : '/Hospiguard/getOptions',
  HOSPIGUARD_GET_FILE : '/Hospiguard/getFile/',
  HOSPIGUARD_TRANSACTION_INQUIRY : '/Hospiguard/transactionInquiry',
  HOSPIGUARD_POST_TRANSACTION : '/Hospiguard/postTransaction',

  USSC_OAUTH_CLIENT_ID : 'zJ1yiTuVMYvn1yrjbixqzIeaJ5y0HcZW',
  USSC_OAUTH_CLIENT_SECRET : 'fumzalPdaDj0k1X28HwRzPN6689OaWt9',
  USSC_OAUTH_TOKEN_URL : 'https://192.168.205.127:1336/oauth/token',

  USSC_SUCCESS_API_CODE : '000000',

  NO_RESPONSE_MSG : 'Oops, you may have weak or no data connection ... Keep calm, wait for a few minutes and try again.',
  GENERIC_ERROR_MSG : 'Oops, you may have weak or no data connection ... Keep calm, wait for a few minutes and try again.',
  OTP_TWO_MINUTES_MSG: 'Please wait for 2 minutes before the system can send an OTP.',

  UMSI_MONEYGRAM_BASE_URL : 'http://192.168.144.119:8000/api/moneygram/',
  UMSI_MONEYGRAM_API_KEY : 'a8e2fca9-e9b2-4175-919a-e5da7b36a648',
  
  UMSI_MONEYGRAM_GET_CODES : 'getcodes',
  UMSI_MONEYGRAM_GET_FIELDS : 'getfields',

  SMS_LIBRARY : 'CSP',
  CSP_URL : 'http://192.168.205.77:8081/ussc-csp/public/api/send-sms',
  CSP_API_KEY : '27qWRwcV0VUPXQoLjggHDoCTZqTiXVqRv4E5RK5XzEjxOMp15qDeNgqFrjIF'

}

module.exports = constants