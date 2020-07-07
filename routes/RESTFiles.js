var db = require( './../functions/mongoUtil' ); // db connection module
const ObjectId = db.obj(); // ObjectID
const multer  = require('multer');
var fs = require('fs');
var jwt = require('./../functions/jwt_func');
var uReq = require('./../functions/usefulReq');
const pify = require('pify');

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

    async function updateFile(req, res) {
      console.log('@@@Operation = PUT FILE  ' + req.params.id);
      try {

        //verify token
        if (req.headers.authorization) {
          var vtoken = jwt.verify(req.headers.authorization.slice(7, req.headers.authorization.length).trimLeft());

          if(vtoken === false){
            res.status(200).json({error : 'bad credentials'});
          }
          else {

            // Requests for user file list
            let user = await uReq.getUserByEmail(vtoken.email);
            let listUser = await uReq.getUserFileList(user);

            // search file in user file list
            var result = listUser.filter(obj => {
                return obj.file == req.params.id
              });

            // check the file is on user list ==> future for different rights
            if (result[0].user = user._id){
              let updateDB = await db.use().collection('files').updateOne({_id: new ObjectId(req.params.id)}, {$set: updateDoc});

              res.status(200).send(updateDB);
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

  updateFile(req, res);

  });



////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // DELETE File

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.delete("/file/:id", function(req, res) {

  async function deleteFile(req, res) {
    console.log('@@@Operation = DELETE FILE  ' + req.params.id);
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
            .sort({_id:-1}).limit(100).toArray();
          let file = await db.use().collection("files").findOne( {  _id: ObjectId(req.params.id) } );
          //console.log('file is ' + JSON.stringify(file));

          // search file in user file list
          var result = listUSer.filter(obj => {
              return obj.file == req.params.id
            });

          // check the file is on user list ==> future for different rights
          if (result[0].user = user._id){
            let deleteDB = await db.use().collection('files').deleteOne({_id: ObjectId(req.params.id)});
            let deleteList = await db.use().collection('fileslist').deleteMany({file: ObjectId(req.params.id)});

            fs.unlinkSync('./uploads/' +  user._id + '/' + file.filename);

            res.status(200).send(file);
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
  app.get("/files", function(req, res) {

  async function getData(req, res) {
    console.log('@@@Operation = GET FILES  ');
    try {
      //verify token
      if (req.headers.authorization) {
        var vtoken = jwt.verify(req.headers.authorization.slice(7, req.headers.authorization.length).trimLeft());

        if(vtoken === false){
          res.status(200).json({error : 'bad credentials'});
        }
        else {

          // 3 DB requests
          let user = await uReq.getUserByEmail(vtoken.email);
          let listUser = await uReq.getUserFileList(user);
          //let listUser = await db.use().collection("fileslist").find({user : ObjectId(user._id)}).sort({_id:-1})
          //  .limit(100).toArray();
          // map file ids from the file list
          var obj_ids = listUser.map((obj) => { return obj.file ; });
          let files = await db.use().collection("files").find( {  _id: {$in: obj_ids } } ).toArray();
          //console.log(files);
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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//POST File

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post('/file', /*upload.single('file')*/ function async (req, res) {


  async function createFile(req, res) {
    console.log('@@@Operation = CREATE FILE  ' + req.params.id);

    try {

      //verify token
      if (req.headers.authorization) {
        var vtoken = jwt.verify(req.headers.authorization.slice(7, req.headers.authorization.length).trimLeft());

        if(vtoken === false){
          res.status(200).json({error : 'bad credentials'});
        }
        else {
          // user folder
          let user = await uReq.getUserByEmail(vtoken.email);
          console.log(JSON.stringify(user));
          if (!fs.existsSync('./uploads/' +  user._id)){
              fs.mkdirSync('./uploads/' +  user._id);
          }
          //upload in folder
          var upload = multer({ dest: './uploads/' +  user._id });
          upload.array('file')(req,res,function(err) {

            ////// add file to DB
             createDBFile = async (req, res) => {
              try {
                req.files[0].owner = user._id;
                req.files[0].createdAt = new Date().toISOString();
                //// collection files
                let newFile = await db.use().collection('files').insertOne(req.files[0]) ;
                let addFileToUser = {
                  file: newFile.ops[0]._id,
                  user: user._id,
                  rigths: 'creator'
                }
                //// collection fileslist
                let newFileInTheList = await db.use().collection('fileslist').insertOne(addFileToUser);
                res.status(200).send(newFile);
              } catch (e) {
                res.status(200).send('error, failed to add file');
              }
            }
            createDBFile(req, res);
            });
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

  createFile(req, res);

});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// download File

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/download/:id', function (req, res) {

  async function downloadFile(req, res) {
    console.log('@@@Operation = DOWNLOAD FILE  ' + req.params.id);
    try {
      if (req.headers.authorization) {
        var vtoken = jwt.verify(req.headers.authorization.slice(7, req.headers.authorization.length).trimLeft());

        if(vtoken === false){
          res.status(200).json({error : 'bad credentials'});
        }
        else {
          let user = await uReq.getUserByEmail(vtoken.email);
          let listUser = await uReq.getUserFileList(user);
          let file = await db.use().collection("files").findOne( {  _id: ObjectId(req.params.id) } );
          console.log('user is ' + JSON.stringify(file));

          res.download('./uploads/' + user._id + '/' + file.filename, file.originalname);



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

  downloadFile(req, res);








});





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
