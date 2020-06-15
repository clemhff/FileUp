var argon2i = require('argon2-ffi').argon2i;
var crypto = require('crypto');


function hashing(password) {
  var tkt = null;
  console.log('entering function with ' + password);


  crypto.randomBytes(32, function(err, salt) {
    if(err) return throwerr;

    argon2i.hash(password, salt)
      .then(hash => {
        console.log(hash);
        tkt = hash;
      });
  });

  return tkt


}

module.exports.hashing = hashing;
