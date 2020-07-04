var db = require( './../functions/mongoUtil' ); // db connection module
const ObjectId = db.obj(); // ObjectID
var jwt = require('./../functions/jwt_func');

module.exports = function(app) {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//last files

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  app.get("/lastentries", function(req, res) {

    if (req.headers.authorization) {
      var vtoken = jwt.verify(req.headers.authorization.slice(7, req.headers.authorization.length).trimLeft());
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

////////////////////////////////////////////////////////////////////////////////////////////////////////
  // GET File

//////////////////////////////////////////////////////////////////////////////////////////////////////////
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


////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // PUT Quote
  
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
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


////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // DELETE File

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.delete("/file/:id", function(req, res) {

  async function deleteFile(req, res) {
    console.log('@@@Operation = delete  ' + req.params.id);
    try {

      //verify token
      if (req.headers.authorization) {
        var vtoken = jwt.verify(req.headers.authorization.slice(7, req.headers.authorization.length).trimLeft());

        if(vtoken === false){
          res.status(200).json({error : 'bad credentials'});
        }
        else {

          // Requests for user file list
          let user = await db.use().collection('users').findOne( { email: vtoken.email}  );
          let listUSer = await db.use().collection("fileslist").find({user : ObjectId(user._id)})
            .sort({_id:-1}).limit(100).toArray()

          // search file in user file list
          var result = listUSer.filter(obj => {
              return obj.file == req.params.id
            });

          // check the file is on user list ==> future for different rights
          if (result[0].user = user._id){
            let deleteDB = await db.use().collection('files').deleteOne({_id: ObjectId(req.params.id)});
            let deleteList = await db.use().collection('fileslist').deleteMany({file: ObjectId(req.params.id)});

            res.status(200).send(deleteList);
          }
          else {
            res.status(203).send({"error":"you don't have rights with result"});
          }


        }
      }
      else {
        res.status(200).json({error : 'no credentials'});
      }
    } catch (e) {
        console.error(e);
        res.status(200).send({error : "something went wrong !"});
    }

  }

  deleteFile(req, res);

});




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //list files for a user

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  app.get("/list", function(req, res) {

  async function getData(req, res) {

    try {
      //verify token
      if (req.headers.authorization) {
        var vtoken = jwt.verify(req.headers.authorization.slice(7, req.headers.authorization.length).trimLeft());

        if(vtoken === false){
          res.status(200).json({error : 'bad credentials'});
        }
        else {

          // 4 DB requests
          let user = await db.use().collection('users').findOne( { email: vtoken.email} );
          let listUser = await db.use().collection("fileslist").find({user : ObjectId(user._id)}).sort({_id:-1})
            .limit(100).toArray();
          // map file ids from the file list
          var obj_ids = listUser.map((obj) => { return obj.file ; });
          let files = await db.use().collection("files").find( {  _id: {$in: obj_ids } } ).toArray();
          console.log(files);
          res.status(200).send(files);
        }
      }
      else {
        res.status(200).json({error : 'no credentials'});
      }
    } catch (e) {
        console.error(e);
        res.status(200).send({error : "something went wrong !"});
    }

  }

  getData(req, res);


  }); // app.get


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   //delete a list entry

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
