var env = process.env.NODE_ENV || 'development';
var config = require('./config.json');
  if(env === 'test' || env === 'development'){
    var envConfig = config[env];  //return the environment either test or dev
    Object.keys(envConfig).forEach((key) => {
      process.env[key] = envConfig[key] 
    })
  }


  