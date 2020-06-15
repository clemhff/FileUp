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


var upload = multer({ dest: './uploads/' })

const env = require('./config/env'); // port and appRouteUrl
const db = require( './functions/mongoUtil' ); // db connection module

//const resume = require('./routes/resume'); // routes from resume.js
const RESTFiles = require('./routes/RESTFiles'); // routes from resume.js
const sign = require('./routes/sign'); // routes from sign.js

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  next();
});

app.use(bodyParser.json({limit: '50000000mb'}));
app.use(bodyParser.urlencoded({limit: '500000000mb', extended: true}));

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


app.post('/file', /*upload.single('file')*/ function (req, res) {
  //upload is multer
    upload.array('file')(req,res,function(err) {
      console.log(JSON.stringify(req.files[0]));

      db.use().collection('files').insertOne(req.files[0], function(err, doc) {
        if (err) {
          handleError(res, err.message, "Failed to create new citation.");
        } else {
          console.log(JSON.stringify(doc.ops[0]));
          res.status(201).json(doc.ops[0]);
        }
      });

    });
   // req.file is the name of your file in the form above, here 'uploaded_file'
   // req.body will hold the text fields, if there were any

});

app.get('/download/:id', function (req, res) {
  fs.readFile(__dirname + '/uploads/' + req.params.id, function (err,data) {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
});

app.get(env.appRootUrl + '*', function(req, res) {
    console.log(path.join(__dirname, '/react_dir/build/index.html'));
    res.sendFile('index.html', {root : __dirname + '/react_dir/build'});
});
