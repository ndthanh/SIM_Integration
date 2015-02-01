// 
/*

http://searchsoa.techtarget.com/tip/REST-vs-SOAP-How-to-choose-the-best-Web-service
http://searchsoa.techtarget.com/answer/Integration-methods-The-pros-and-cons-of-REST-integration-with-SOA
http://www.indiawebdevelopers.com/resource_center/articles/soa.html


Documentation:

.-----------------------------------------------------------------.
| Route             | HTTP verb     |   Desc                      |
.-----------------------------------------------------------------.
|/api/user          | GET           | get All users               |
.-----------------------------------------------------------------.
|/api/user          | POST          | add new user                |
.-----------------------------------------------------------------.
|/api/user/:user_id | GET           | add a user (for editing)    |
.-----------------------------------------------------------------.
|/api/user/:user_id | PUT           | update a user               |
.-----------------------------------------------------------------.
|/api/user/:user_id | DELETE        | delete a user               |
.-----------------------------------------------------------------.


Test with curl:

change apiMode to true

# Get all user
curl -is4 localhost:3000/api/user

# Get a user with :user_id
curl -is4 localhost:3000/api/user/:user_id

*/


var express  = require('express'),
    path     = require('path'),
    bodyParser = require('body-parser'),
    app = express(),
    expressValidator = require('express-validator');


/*Set EJS template Engine*/
app.set('views','./views');
app.set('view engine','ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true })); //support x-www-form-urlencoded
app.use(bodyParser.json());
app.use(expressValidator());

var apiMode = false;

/*MySql connection*/
var connection  = require('express-myconnection'),
    mysql = require('mysql');

app.use(

    connection(mysql,{
        host     : 'localhost',
        user     : 'root',
        password : 'Hanoi2015',
        database : 'movedb',
        debug    : false //set true if you wanna see debug logger
    },'request')

);

app.get('/',function(req,res){
    res.send('Welcome to REST service!');
});


//RESTful route
var router = express.Router();


/*------------------------------------------------------
*  This is router middleware,invoked everytime
*  we hit url /api and anything after /api
*  like /api/user , /api/user/7
*  we can use this for doing validation,authetication
*  for every route started with /api
--------------------------------------------------------*/
router.use(function(req, res, next) {
    console.log(req.method, req.url);
    next();
});

var curut = router.route('/user');


//show the CRUD interface | GET
curut.get(function(req,res){


    req.getConnection(function(err,conn){

        if (err) return next("Cannot Connect");

        var query = conn.query('SELECT * FROM CUSTOMER',function(err,rows){

            if(err){
                console.log(err);
                return next("Mysql error, check your query");
            }
            if(!apiMode){
                res.render('user',{title:"Data Service with REST",data:rows});
            } else {
                res.send('user',{title:"EndPoint: /User", data:rows});
            }
            
            
         });

    });

});
//post data to DB | POST
curut.post(function(req,res){

    // validation
    req.assert('STATUS','Status is required').notEmpty();
    req.assert('FIRSTNAME','Firstname is required').notEmpty();
    req.assert('LASTNAME','Lastname is required').notEmpty();

    req.assert('COUNTRY','Only country code with 2 characters is allowed').len(2);

    var errors = req.validationErrors();
    if(errors){
        res.status(422).json(errors);
        return;
    }

    //get data
    var data = {
        STATUS         : req.body.STATUS,
        FIRSTNAME      : req.body.FIRSTNAME,
        LASTNAME       : req.body.LASTNAME,
        STREET         : req.body.STREET,
        CITY           : req.body.CITY,
        SHIRE          : req.body.SHIRE,
        POSTCODE       : req.body.POSTCODE,
        COUNTRY        : req.body.COUNTRY,
        PAYMENT_METHOD : req.body.PAYMENT_METHOD
     };

    //inserting into mysql
    req.getConnection(function (err, conn){

        if (err) return next("Cannot Connect");

        var query = conn.query("INSERT INTO CUSTOMER set ? ",data, function(err, rows){

           if(err){
                console.log(err);
                return next("Mysql error, check your query");
           }

          res.sendStatus(200);

        });

     });

});


//now for Single route (GET,DELETE,PUT)
var curut2 = router.route('/user/:user_id');

/*------------------------------------------------------
route.all is extremely useful. you can use it to do
stuffs for specific routes. for example you need to do
a validation everytime route /api/user/:user_id it hit.

remove curut2.all() if you dont want it
------------------------------------------------------*/
curut2.all(function(req,res,next){
    console.log("You need to smth about curut2 Route ? Do it here");
    console.log(req.params);
    next();
});

//get data to update
curut2.get(function(req,res,next){

    var user_id = req.params.user_id;

    req.getConnection(function(err,conn){

        if (err) return next("Cannot Connect");

        var query = conn.query("SELECT * FROM CUSTOMER WHERE CUSTOMER_ID = ? ",[user_id],function(err,rows){

            if(err){
                console.log(err);
                return next("Mysql error, check your query");
            }

            //if user not found
            if(rows.length < 1)
                return res.send("User Not found");

            if(!apiMode){
                res.render('edit',{title:"Edit user",data:rows});
            } else {
                res.send({title: "Details for " + user_id, data:rows});
            }
        });

    });

});

//update data
curut2.put(function(req,res){
    var user_id = req.params.user_id;

    // validation
    req.assert('STATUS','Status is required').notEmpty();
    req.assert('FIRSTNAME','Firstname is required').notEmpty();
    req.assert('LASTNAME','Lastname is required').notEmpty();

    req.assert('COUNTRY','Only country code with 2 characters is allowed').len(2);

    var errors = req.validationErrors();
    if(errors){
        res.status(422).json(errors);
        return;
    }

    //get data
    var data = {
        STATUS         : req.body.STATUS,
        FIRSTNAME      : req.body.FIRSTNAME,
        LASTNAME       : req.body.LASTNAME,
        STREET         : req.body.STREET,
        CITY           : req.body.CITY,
        SHIRE          : req.body.SHIRE,
        POSTCODE       : req.body.POSTCODE,
        COUNTRY        : req.body.COUNTRY,
        LASTORDER      : req.body.LASTORDER,
        LAST_ADVERTISINGCAMPAIGN        : req.body.LAST_ADVERTISINGCAMPAIGN,
        PAYMENT_METHOD : req.body.PAYMENT_METHOD
     };

    //inserting into mysql
    req.getConnection(function (err, conn){

        if (err) return next("Cannot Connect");

        var query = conn.query("UPDATE CUSTOMER set ? WHERE CUSTOMER_ID = ? ",[data,user_id], function(err, rows){

           if(err){
                console.log(err);
                return next("Mysql error, check your query");
           }

          res.sendStatus(200);

        });

     });

});

//delete data
curut2.delete(function(req,res){

    var user_id = req.params.user_id;

     req.getConnection(function (err, conn) {

        if (err) return next("Cannot Connect");

        var query = conn.query("DELETE FROM CUSTOMER  WHERE CUSTOMER_ID = ? ",[user_id], function(err, rows){

             if(err){
                console.log(err);
                return next("Mysql error, check your query");
             }

             res.sendStatus(200);

        });
        //console.log(query.sql);

     });
});

//now we need to apply our router here
app.use('/api', router);

//start Server
var server = app.listen(3000,function(){

   console.log("Listening to port %s",server.address().port);

});
