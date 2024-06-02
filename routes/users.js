const express = require("express");
const router = express.Router();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const usersController = require("../controllers/usersController");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/users/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, cb) {
      // Always pass the profile to the cb function
      return cb(null, profile);
    }
  )
);

router.get('/', (req, res) => {
  res.send('home');
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).send({ message: 'User is not authenticated' });
}

router.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.send('dashboard');
});

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/auth/google/callback", usersController.googleAuthCallback);

module.exports = router;