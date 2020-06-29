var db = require( './../functions/mongoUtil' ); // db connection module
const ObjectId = db.obj(); // ObjectID
var jwt = require('./../functions/jwt_func');

module.exports = function(app) {

  app.get("/lastentries", function(req, res) {

    if (req.headers.authorization) {
      let token = req.headers.authorization;
      token = token.slice(7, token.length).trimLeft();

      var vtoken = jwt.verify(token);
      console.log('verif token lastentries = ' + JSON.stringify(vtoken));
      //console.log('verif decode token lastentries = ' + JSON.stringify(jwt.decode(token)));

      if(vtoken === false){
        res.status(200).json({error : 'bad credentials'});
      }

      else {
        db.use().collection("files").find({}).sort({_id:-1}).limit(100)
          .toArray(function(err, entry) {
            if (err) {
              //handleError(res, err.message, "Failed to get citations.");
              res.status(503).json({"error":"database not in service"});
            } else {
              res.status(200).json(entry);
            }
        });
      }

    }


  });








  // GET File
  app.get("/file/:id", function(req, res) {
    db.use().collection('files').findOne({ _id: ObjectId(req.params.id) }, function(err, doc) {
      if (err) {
        res.status(503).json({"error":"database not in service"});
      }
      else if (doc !== null) {
        res.status(200).json(doc);
      }
      else{
        res.status(400).json({"error":"This ID does not exist"});
      }
    });
  });

  // PUT Quote
  app.put("/file/:id", function(req, res) {
    var updateDoc = req.body;
    delete updateDoc._id;
    db.use().collection('files').updateOne({_id: new ObjectId(req.params.id)}, {$set: updateDoc}, function(err, doc) {
      if (err) {
        res.status(503).json({"error":"database not in service"});
      }
      else if (doc !== null) {
        res.status(200).json(doc);
      }
      else{
        res.status(400).json({"error":"This ID does not exist"});
      }
    });
  });


  // DELETE Quote
  app.delete("/file/:id", function(req, res) {

    if (req.headers.authorization) {
      let token = req.headers.authorization;
      token = token.slice(7, token.length).trimLeft();

      var vtoken = jwt.verify(token);
      console.log('verif token delete = ' + JSON.stringify(vtoken));

      //FIND USER ID
      db.use().collection('users').findOne( { email: vtoken.email}  , function(err, user) {
        if (err) throw err;
        else {
          // FIND LIST OF FILES the user can delete
          db.use().collection("fileslist").find({user : ObjectId(user._id)}).sort({_id:-1}).limit(100)
            .toArray(function(err, entry) {
              if (err) {
                //handleError(res, err.message, "Failed to get list.");
                res.status(503).json({"error":"database not in service"});
              } else {
                var result = entry.filter(obj => {
                  return obj.file == req.params.id
                });
                console.log('result = ' + JSON.stringify(result));
                //console.log('user = ' + user._id);
                if (result === [] || !result[0]){
                  res.status(203).send({"error":"you don't have rights with result"});
                }

                else {
                  if (result[0].user = user._id){
                    db.use().collection('files').deleteOne({_id: ObjectId(req.params.id)}, function(err, result) {
                        if (err) {
                          res.status(503).json({"error":"database not in service"});
                        } else {
                          db.use().collection('fileslist').deleteMany({file: ObjectId(req.params.id)}, function(err, list) {
                            if (err) {
                              res.status(503).json({"error":"database not in service"});
                            } else {
                              res.status(203).send(list);
                            }
                          });
                        }
                    });
                  }
                  else {
                    res.status(403).send({"error":"you don't have rights"});
                  }

                }
              }
          });
        }
      });

    }



  /*  db.use().collection('files').deleteOne({_id: ObjectId(req.params.id)}, function(err, result) {
      if (err) {
        res.status(503).json({"error":"database not in service"});
      } else {
        res.status(204).send({"sucess":"file deleted"});
      }
    });*/
  });

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //list file for a user
  app.get("/list", function(req, res) {


    if (req.headers.authorization) {
      let token = req.headers.authorization;
      token = token.slice(7, token.length).trimLeft();

      var vtoken = jwt.verify(token);
      //console.log('verif token lastentries = ' + JSON.stringify(vtoken));
      //console.log('verif decode token lastentries = ' + JSON.stringify(jwt.decode(token)));

      if(vtoken === false){
        res.status(200).json({error : 'bad credentials'});
      }

      else {
        db.use().collection('users').findOne( { email: vtoken.email}  , function(err, user) {
          if (err) throw err;
          else {


            db.use().collection("fileslist").find({user : ObjectId(user._id)}).sort({_id:-1}).limit(100)
              .toArray(function(err, entry) {
                if (err) {
                  //handleError(res, err.message, "Failed to get list.");
                  res.status(503).json({"error":"database not in service"});
                } else {

                  var obj_ids = entry.map((obj) => { return obj.file ; });
                  //res.status(200).json(obj_ids);

                  db.use().collection("files").find( {  _id: {$in: obj_ids } } ).toArray(function(err, list) {
                    if (err) {
                      res.status(503).json({"error":"database not in service"});
                    } else {
                      res.status(200).json(list);
                    }
                  });// db file

                }
            }); // db fileslist
          }

        }); // db user



      }

    } // if auth


  }); // app.get

  /////////////////////////////////////////////////////////////////////////////////////////////////////////
  app.delete("/list/:id", function(req, res) {
    db.use().collection('fileslist').deleteOne({_id: ObjectId(req.params.id)}, function(err, result) {
      if (err) {
        res.status(503).json({"error":"database not in service"});
      } else {
        res.status(204).send({"sucess":"file deleted"});
      }
    });
  });


}
