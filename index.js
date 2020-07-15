const express = require('express');
const app = express();
const mongodb = require("mongodb");
const path = require('path');
const bodyParser = require('body-parser');
const multer  = require('multer');
var fs = require('fs');
const jwt = require('express-jwt');
var argon2i = require('argon2-ffi').argon2i;
var crypto = require('crypto');
var jwtp = require('./functions/jwt_func');
const pify = require('pify');


//var upload = multer({ dest: './uploads/' })

const env = require('./config/env'); // port and appRouteUrl
const db = require( './functions/mongoUtil' ); // db connection module

//const resume = require('./routes/resume'); // routes from resume.js
const RESTFiles = require('./routes/RESTFiles'); // routes from resume.js
const sign = require('./routes/sign'); // routes from sign.js

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Authorization, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  next();
});

app.use(bodyParser.json({limit: '200mb'}));
app.use(bodyParser.urlencoded({limit: '200mb', extended: true}));

app.use(env.appRootUrl + '/public', express.static(__dirname + '/react_dir/build/public'));
app.use(env.appRootUrl + '/static', express.static(__dirname + '/react_dir/build/static')); // put an environnement variable for '/reactdev'
//console.log(__dirname + + '/react_dir/build/public');

// Connect to the database before starting the application server.
db.connectDb( function( err, client ) {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || env.port, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});


// URL routing
//resume (app);
RESTFiles (app);
sign(app);


/*app.post('/file', *//*upload.single('file')*/ /*function (req, res) {

  console.log('headers are' + JSON.stringify(req.headers));
  if (req.headers.authorization){
    let token = req.headers.authorization;
    token = token.slice(7, token.length).trimLeft();
    //console.log(JSON.stringify(token));

    var vtoken = jwtp.verify(token);
    console.log('verif file vtoken =' + JSON.stringify(vtoken));

    if(vtoken === false){
      res.status(200).json({error : 'bad credentials'});
    }

    else {

        //console.log(JSON.stringify(req.files[0]));
        console.log(vtoken.email);

        //mettre un try
        db.use().collection('users').find( { email: vtoken.email} ).toArray(function(err, result) {
          if (err) throw err;
          else {
            console.log(JSON.stringify(result[0]));

            if (!fs.existsSync('./uploads/' +  result[0]._id)){
                fs.mkdirSync('./uploads/' +  result[0]._id);
            }
            var upload = multer({ dest: './uploads/' +  result[0]._id });
            upload.array('file')(req,res,function(err) {
              req.files[0].owner = result[0]._id;

              db.use().collection('files').insertOne(req.files[0], function(err, doc) {
                if (err) {
                  handleError(res, err.message, "Failed to create new file step 1.");
                } else {

                  let addFileToUser = {};
                  addFileToUser.file = doc.ops[0]._id;
                  addFileToUser.user = doc.ops[0].owner;
                  addFileToUser.rights = 'creator';


                  db.use().collection('fileslist').insertOne(addFileToUser, function(err, doc) {
                    if (err) {
                      handleError(res, err.message, "Failed to create new file step 2.");
                    } else {
                      res.status(201).json(doc.ops[0]);
                    }
                  });
                  *//*delete newUser.owner;
                  delete newUser.viewer;
                  delete newUser._id;
                  delete newUser.createdDate;*/

                /*}
              });

            });
            // req.file is the name of your file in the form above, here 'uploaded_file'
            // req.body will hold the text fields, if there were any
          }
        });

    }

  }


});*/

/*app.get('/download/:id', function (req, res) {
  fs.readFile(__dirname + '/uploads/' + req.params.id, function (err,data) {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
});*/

app.get(env.appRootUrl + '*', function(req, res) {
    console.log(path.join(__dirname, '/react_dir/build/index.html'));
    res.sendFile('index.html', {root : __dirname + '/react_dir/build'});
});
