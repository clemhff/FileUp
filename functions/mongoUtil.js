const MongoClient = require( 'mongodb' ).MongoClient;
const ObjectID = require( 'mongodb' ).ObjectID;
const env = require('./../config/env'); // password and login configurations to access to the database

var _db;

function connectDb(callback) {
  MongoClient.connect( env.dbUrl,  {useUnifiedTopology: true, useNewUrlParser: true }, function( err, client ) {
    _db  = client.db(env.bdd);
    return callback( err );
  } );
}

function use() {
  return _db;
}

function obj() {
  return ObjectID;
}


function closeDb() {
  _db.close();
}


module.exports = {
  connectDb,
  use,
  closeDb,
  obj
}
