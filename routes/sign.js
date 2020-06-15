var argon2i = require('argon2-ffi').argon2i;
var crypto = require('crypto');

//const argon = require( './../functions/argon' );
var db = require( './../functions/mongoUtil' ); // db connection module
const ObjectId = db.obj(); // ObjectID

module.exports = function(app) {

  app.post("/signup", function(req, res) {
    var body = req.body;
    var newUser = {} ;
    newUser.userName = body.userName;
    newUser.email = body.email;

    newUser.createdDate = new Date();


    //hashing password
    crypto.randomBytes(256, function(err, salt) {
      if(err) throwerr;

      argon2i.hash(body.password, salt)
        .then(hash => {
          var tkt = hash;
          newUser.passwordHashed = tkt;
          db.use().collection('users').insertOne(newUser, function(err, doc) {
            if (err) {
              handleError(res, err.message, "Failed to create new user.");
            } else {
              console.log(JSON.stringify(doc.ops[0]));
              delete newUser.passwordHashed;
              res.status(201).json(newUser);
            }
          })
        });
    });

  });



    app.post("/signin", function(req, res) {
      db.use().collection('users').find( { email: req.body.email } ).toArray(function(err, result) {
        if (err) throw err;
        argon2i.verify(result[0].passwordHashed, req.body.password)
          .then(correct => {
            console.log(correct ? 'Correct password!' : 'Incorrect password');
            var resp;
            correct ? resp = 'Correct password!' : resp = 'Incorrect password';
            res.status(201).json({auth : resp});
          });
        //res.status(201).json(result);
      });
    });


    /*if (!(req.body.email && req.body.username)) {
      handleError(res, "Invalid user input", "Must provide a email and a username.", 400);
    }
    else {db.use().collection('users').insertOne(newUser, function(err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to create the user");
      } else {
        console.log(JSON.stringify(doc.ops[0]));
        res.status(201).json(doc.ops[0]);
      }
    })};
    */


} //close main function
