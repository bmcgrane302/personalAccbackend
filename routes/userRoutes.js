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

   //console.log('id is',req.decoded.id);
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
     //console.log('expenses', expenses);
     res.json(expenses);
   });

});

router.post('/addincome', (req, res) => {
  //console.log('id is',req.decoded.id);
  knex('income')
    .insert({
      income_description:req.body.newIncome.income_description,
      income_budget:req.body.newIncome.income_budget,
      income_amount_received:req.body.newIncome.income_amount_received,
      users_id:req.decoded.id
    })
    .returning('*')
    .then(income => {
      res.send(income)


    // .then(() => {
    //   //console.log('income',req.body);
    //   knex('income')
    //     .select()
    //     .then((income) => {
    //       console.log(income);
    //       res.json(income)
    //     })
    })
})

router.post('/addexpense', (req, res) => {
  //console.log('id is',req.decoded.id);
  knex('expenses')
    .insert({
      expense_description:req.body.newExpense.expense_description,
      expense_budget:req.body.newExpense.expense_budget,
      users_id:req.decoded.id
    })
    .returning('*')
    .then(expense => {
      res.send(expense)
      // console.log('expenses',req.body);
      // knex('expenses')
      //   .select()
      //   .then((expenses) => {
      //     console.log(expenses);
      //     res.json(expenses)
      //   })
    })
})

router.patch('/updateexpense/:id', (req, res) => {
  //console.log("req.body.newExpense", req.body )
  knex('expenses')
    .update({expense_amount_paid: req.body.updateExpense})
    .where('id', req.body.id)
    .then(() => {
        knex('expenses')
          .where('users_id', req.decoded.id)
          .select()
          .then(expenses => res.json(expenses))
      }
    )
})

router.patch('/updateincome/:id', (req, res) => {
  //console.log("req.body.id",  req.decoded.id )
  knex('income')
    .update({income_amount_received: req.body.updateIncome})
    .where('id', req.body.id)
    .then(() => {
        knex('income')
          .where('users_id', req.decoded.id)
          .select()
          .then(income => res.json(income))
      }
    )
})

router.delete('/deleteincome/:id', (req, res) => {
  console.log("delete income", req.params)
  knex('income')
    .del()
    .where('id', req.params.id)
    .then(() => {
      knex('income')
        .where('users_id', req.decoded.id)
        .select()
        .then(income => res.json(income))
    })
})

router.delete('/deleteexpense/:id', (req, res) => {
  console.log("delete expense", req.params)
  knex('expenses')
    .del()
    .where('id', req.params.id)
    .then(() => {
      knex('expenses')
        .where('users_id', req.decoded.id)
        .select()
        .then(expenses => res.json(expenses))
    })
})





////////////////////////////////////////////////////////////////////////////
function jwtAuth(req, res, next){
 //send as a query parameter!
 var token = req.body.token || req.query.token || req.headers['x-access-token']|| req.params.token;
 console.log("token is" + token);
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
