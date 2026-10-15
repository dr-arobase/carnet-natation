const rateLimit = require('express-rate-limit');
module.exports = function(){
  return rateLimit({ windowMs: 60*1000, max: 60 });
};
