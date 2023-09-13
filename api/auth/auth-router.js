const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const {  addUser,  findBy } = require('../users/users-models');
const { jwtSecret }= require('../../config')

router.post('/register', async (req, res) => {
  
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "username and password required" });
    }

    const existingUser = await findBy({ username: req.body.username });

    if (existingUser.length > 0) {
      return res.status(400).json({ error: "username taken" });
    }

    const rounds = Math.pow(8); 
    try {
     
      const hash = bcrypt.hashSync(password, rounds);

    const newUser = await addUser({
      username,
      password: hash,
    });

    res.status(201).json({
      id: newUser.id,
      username: newUser.username,
      password: newUser.password,
    });
  }
    catch (error) {
      console.error("An error occurred:", error);
      return res.status(500).json({ error: 'Server error' });
  }

});

router.post('/login', async (req, res) => {
  
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "username and password required" });
    }

    const user = await findBy({username});
    //console.log("Full user object:", user);
    //console.log("Retrieved user from the database:", user);
    
    if (user && user.length > 0 && bcrypt.compareSync(password, user[0].password)) {
     
      //console.log("Generating token for user:", user[0].username);
      

      const token = jwt.sign(
        {
          subject: user[0].id,
          username: user[0].username,
        },
        jwtSecret,
        {
          expiresIn: '1d',
        }
      );
      

      console.log("Generated token:", token);

      res.status(200).json({ message: `Welcome, ${username}`, token });
      
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
});



module.exports = router;
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */