const jwt = require('jsonwebtoken')
const { jwtSecret } = require('../../config')
const { token } = require('../auth/auth-router')


// module.exports = (req, res, next) => {
//   let token = req.headers.authorization;
  
//   console.log("Received token:", token);
  
//   if (token) {
//     if (token.startsWith("Bearer ")) {
//       // Extract actual token after "Bearer "
//       token = token.slice(7, token.length);
//       console.log("token", token)
      
//     }

//     jwt.verify(token, jwtSecret, (err, decodedToken) => {
//       if (err) {
//         console.log("Verification error:", err);
        
//         if (err.name === 'JsonWebTokenError') {
         
//           return res.status(400).json({ message: 'Malformed token' });
//         }
        
//         return res.status(401).json({ message: 'Token invalid' });
//       } else {
//         console.log("Decoded token:", decodedToken);
//         req.decodedToken = decodedToken;
//         next();
//       }
//     });
//   } else {
//     console.log("No token provided");
//     return res.status(401).json({ message: 'Token required' });
//   }
// };
module.exports = (req, res, next) => {
  if (!req.headers || !req.headers.authorization) {
      console.log("No token provided");
      return res.status(401).json({ message: 'Token required' });
  }

  let token = req.headers.authorization;
  console.log("Received token:", token);
  
  if (token.startsWith("Bearer ")) {
      // Extract the actual token after "Bearer "
      token = token.slice(7, token.length);
      console.log("Extracted token:", token);
  }

  verifyToken(token, (err, decodedToken) => {
    if (!err) {
      console.log("Decoded token:", decodedToken);
      req.decodedToken = decodedToken;
      next();
  } else {
      console.log("Verification error:", err);
      handleTokenError(err, res);
  }
  });
};

const verifyToken = (token, callback) => {
  jwt.verify(token, jwtSecret, callback);
};

const handleTokenError = (err, res) => {
  if (err.name === 'JsonWebTokenError') {
      return res.status(400).json({ message: 'Token invalid' });
  }
  return res.status(401).json({ message: 'Token invalid' });
};



  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */

