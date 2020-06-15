var db = require( './../functions/mongoUtil' ); // db connection module
const ObjectId = db.obj(); // ObjectID

module.exports = function(app) {

  app.get("/lastentries", function(req, res) {

    db.use().collection("files").find({}).sort({_id:-1}).limit(100)
      .toArray(function(err, entry) {
        if (err) {
          //handleError(res, err.message, "Failed to get citations.");
          res.status(503).json({"error":"database not in service"});
        } else {
          res.status(200).json(entry);
        }
    });
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
    db.use().collection('files').deleteOne({_id: ObjectId(req.params.id)}, function(err, result) {
      if (err) {
        res.status(503).json({"error":"database not in service"});
      } else {
        res.status(204).send({"sucess":"file deleted"});
      }
    });
  });


}
