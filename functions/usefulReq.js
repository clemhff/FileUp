var db = require( './../functions/mongoUtil' ); // db connection module
const ObjectId = db.obj(); // ObjectID


module.exports = {

  getUserByEmail: async (email) => {
    let user = await db.use().collection('users').findOne( { email: email}  );
    return user;
  },

  getUserFileList: async (user) => {
    let listUser = await db.use().collection("fileslist").find({user : ObjectId(user._id)}).sort({_id:-1})
      .limit(100).toArray();
    return listUser;
  }

}
