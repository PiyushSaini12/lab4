
const passport = require('passport');

exports.isLoggedIn = (req, res, next) => {

  if (req.isAuthenticated()) {
    next();
    return;
  }
  res.redirect('/login');
};

exports.login = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureMessage: 'Invalid Login',
});

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
    return;
  }
  res.redirect('/login');
};
