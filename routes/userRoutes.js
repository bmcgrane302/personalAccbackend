var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var jwt = require('jsonwebtoken');
const jwtSecret = "nickfolessuperbowlmvp";
/* GET home page. */
router.get('/', (req, res) => {
  knex('income')
    .then(function(income) {
      res.json(income);
    });
});

router.post('/login', (req,res)=>{
  knex('users').where('username', req.body.email).then((user)=>{
    user = user[0];
    if(user.password != req.body.password){
      res.sendStatus(500);
    }else{

      let token = jwt.sign({id: user.id}, jwtSecret, {
        expiresIn: 86400
      })

      res.json({token: token});
    }
  })
});

router.use(jwtAuth)

router.post('/ping', (req, res)=>{
  // req.decoded.id === session////////////////////////////******************
  console.log(req.decoded);
  res.json('pong')
})





function jwtAuth(req, res, next){
 //send as a query parameter!
 var token = req.body.token || req.query.token || req.headers['x-access-token'];

 // decode token
 if (token) {

   // verifies secret and checks exp
   jwt.verify(token, jwtSecret, function(err, decoded) {
     if (err) {
       return res.json({ success: false, message: 'Failed to authenticate token.' });
     } else {
       // if everything is good, save to request for use in other routes
       req.decoded = decoded;
       console.log(req.decoded);
       next();
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
module.exports = router;
