/**
 * Created by ogeva on 7/1/2017.
 */
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// indicates the api server is up
router.get('/alive', (req, res) => {
  res.send('auth works');
});


/**
 * get a token
 */
router.post('/authenticate', (req, res, next) => {
  console.log('ip', req.ip);
  const payload = {
    ip: req.ip
  };

  // if a token exists for the ip and is not expired
  //TODO
  req.db.collection('tokens').findOne({'ip': req.ip},
    function (err, result) {
      if (err) {
        res.status(500).json({error: err});
        return;
      }
      if (result) {
        res.status(200).json({
          success: true,
          token: result.token
        });
        return;
      } else {
        //if a token doesn't exist for the ip, create new token
        const token = jwt.sign(payload, req.properties.jwtSecret, {
          expiresIn: req.properties.jwtExpiresIn // expires in 24 hours
        });
        //insert in db
        req.db.collection('tokens').insertOne({'ip': req.ip, 'token': token},
          function (err, result) {
            if (err) {
              res.status(500).json({error: err});
            }
            res.status(200).json({
              success: true,
              token: token
            });
          });
      }
    });


});

module.exports = router;
