const jwt = require('jsonwebtoken')
const { jwtSecret } = require('../../config')

// module.exports = (req, res, next) => {
//   const token = req.headers.authorization;
  
//   if (token) {
//     jwt.verify(token, jwtSecret, (err, decodedToken) => {
//       if (err) {
//         res.status(401).json({ message: 'Token invalid' });
//       } else {
//         req.decodedToken = decodedToken;
//         next();
//       }
//     });
//   } else {
//     res.status(401).json({ message: 'Token required' });
//   }
// }
module.exports = (req, res, next) => {
  let token = req.headers.authorization;

  // Log the token to see what you're getting from the headers
  console.log("Received token:", token);

  if (token) {
    // Remove 'Bearer ' from the token if it exists
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
    }

    jwt.verify(token, jwtSecret, (err, decodedToken) => {
      // Log any errors from the jwt.verify function
      if (err) {
        console.log("Verification error:", err);
        res.status(401).json({ message: 'Token invalid' });
      } else {
        // Log the decoded token to understand its structure
        console.log("Decoded token:", decodedToken);

        req.decodedToken = decodedToken;
        next();
      }
    });
  } else {
    console.log("No token provided");
    res.status(401).json({ message: 'Token required' });
  }
}


  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */

