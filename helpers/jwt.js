const jwt = require('jsonwebtoken');
//const expressjwt = require('express-jwt');
const User = require('../models/User');

exports.verifyToken  = (req, res, next) => {

    // check header or url parameters or post parameters for token
    //console.log(req.headers);
    var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['authorization'];
  
    // decode token
    if (token) {
  
      // verifies secret and checks exp
      jwt.verify(token, process.env.TOKEN_GENERATOR, function(err, decoded) {      
        if (err) {
          return res.json({ success: false, message: 'Failed to authenticate token.' });    
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;
          //save the user into req:
          //console.log(decoded);
          User.findById(decoded.sub)
          .then(user=>{
              req.user = user;
              next();
          })
          .catch(e=>next());
          
        }
      });
  
    } else {
  
      // if there is no token
      // return an error
      return res.status(403).send({ 
          success: false, 
          message: 'No token provided.' 
      });
  
    }
  }

exports.genToken = (user)=>{
    const token = jwt.sign({
        sub: user._id,
        username: user.email
    }, 
    process.env.TOKEN_GENERATOR, 
    {expiresIn:"72 hours"} //si no lo pones no expira
    );
    return token;
};
