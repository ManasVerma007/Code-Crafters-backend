const passport = require("passport");
const authService = require("../services/authService");

exports.googleAuthCallback = function (req, res, next) {
  passport.authenticate("google", async function (err, profile, info) {
    if (err) {
      return next(err);
    }
    // Use authService to check the email domain
    const { isValid, message } = authService.checkEmailDomain(profile);
    if (!isValid) {
      // If the email domain is not what you want, send an error message
      return res.status(400).send({ message });
    }
    // Use authService to find or create the user
    const user = await authService.findOrCreateUser(profile);
    // Use authService to log in the user
    try {
      const loginResponse = await authService.logInUser(req, user, next);
      console.log('Login response:', loginResponse);
      return res.status(200).json({ message: 'User logged in successfully', user });
      // return res.redirect("/users");
    } catch (err) {
      return next(err);
    }
  })(req, res, next);
};