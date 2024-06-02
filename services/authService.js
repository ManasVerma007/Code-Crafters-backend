const User = require('../models/User');

exports.findOrCreateUser = async (profile) => {
  let user = await User.findOne({ googleId: profile.id });
  if (!user) {
    user = new User({
      googleId: profile.id,
      username: profile.displayName,
      email: profile._json.email
    });
    await user.save();
  }
  return user;
};

exports.checkEmailDomain = function(user) {
  const emailDomain = user._json.email.split("@")[1];
  if (emailDomain !== "ds.study.iitm.ac.in") {
    return { isValid: false, message: "Invalid email domain" };
  }
  return { isValid: true };
};

exports.logInUser = function(req, user, next) {
  return new Promise((resolve, reject) => {
    req.logIn(user, function(err) {
      if (err) {
        reject(err);
      }
      // console.log(user);
      // console.log('session', req.sessionID);
      resolve({ user: user, sessionID: req.sessionID, cookies: req.cookies });
    });
  });
};