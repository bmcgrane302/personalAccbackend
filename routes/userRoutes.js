var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var jwt = require('jsonwebtoken');
const jwtSecret = "nickfolessuperbowlmvp";
/* GET home page. */


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
  //console.log('token',req.decoded);
  res.json('pong')
})

router.get('/income', (req, res) => {

   console.log('id is',req.decoded.id);
   knex('income')
   .where('users_id',req.decoded.id)
   .then(function(income) {
     //console.log(income);
     res.json(income);
   });

});

router.get('/expenses', (req, res) => {

   //console.log('id is',req.decoded.id);
   knex('expenses')
   .where('users_id',req.decoded.id)
   .then(function(expenses) {
     //console.log(expenses);
     res.json(expenses);
   });

});

router.post('/addincome', (req, res) => {
  console.log('id is',req.decoded.id);
  knex('income')
    .insert({
      income_description:req.body.newIncome.income_description,
      income_budget:req.body.newIncome.income_budget,
      users_id:req.decoded.id
    })
    .then(() => {
      console.log('income',req.body);
      knex('income')
        .select()
        .then((income) => {
          console.log(income);
          res.json(income)
        })
    })
})







////////////////////////////////////////////////////////////////////////////
function jwtAuth(req, res, next){
 //send as a query parameter!
 var token = req.body.token || req.query.token || req.headers['x-access-token']|| req.params.token;
 console.log(token);
 // decode token
 if (token) {

   // verifies secret and checks exp
   jwt.verify(token, jwtSecret, function(err, decoded) {
     if (err) {
       return res.json({ success: false, message: 'Failed to authenticate token.' });
     } else {
       // if everything is good, save to request for use in other routes
       req.decoded = decoded;
       console.log("request decoded" + req.decoded);
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
