const passport = require('passport');
const myDB = require('./connection');
const bcrypt = require('bcrypt');
module.exports = function(app, myDataBase){

  function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
};

  passport.serializeUser((user,done)=>{
    done(null,user._id);

  })
  passport.deserializeUser((id,done)=> {
    myDB.findOne({_id: new ObjectId(id)},(err,doc)=>{
      done(null,doc);})
  })

}
