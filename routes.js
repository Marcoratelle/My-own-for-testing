const passport = require('passport');
const bcrypt = require('bcrypt');
module.exports = function(app, myDataBase){

  //authenticated
  function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
};
  //HOMEPAGE
  app.route('/').get((req, res) => {
    res.render('./pug/index', {
      title: 'Connected to Database',
      message: 'Please login',
      showLogin: true,
      showRegistration: true
    });
  });
  //LOGIN
  app.route('/login').post(passport.authenticate('local', { failureRedirect: '/' }), (req, res) => {
   res.redirect('/profile');
  });
  //PROFILE
  app.route('/profile').get(ensureAuthenticated,function(req,res){
    res.render('./pug/profile',{ username:req.user.username})
  });
  //LOG OUT
  app.route('/logout').get((req,res)=>{
    req.logout();
    res.redirect('/');
  });
  //REGISTER
  app.route('/register').post((req, res, next)=>{const hash = bcrypt.hashSync(req.body.password,12);
    myDataBase.findOne({ username: req.body.username }, function(err, user){
    if (err){
      next(err);
    }else if (user) {
      res.redirect('/')
    }else {
      myDataBase.insertOne({
        username: req.body.username,
        password: hash
      },(err, doc)=> {
        if (err) {
          res.redirect('/')
        }else {
          next(null, doc.ops[0]);
        }
      }
    )
  }

  },passport.authenticate('local', { failureRedirect: '/'}), (req, res, next) => {
    res.redirect('/profile');})
  })
  app.use((req,res,next)=>{
    res.status(404)
  .type('text')
  .send('Not found');
  });

}
