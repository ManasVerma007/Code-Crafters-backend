require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const usersRouter = require('./routes/users'); 
const flash = require('connect-flash');
const MongoStore = require('connect-mongo');
const cors = require('cors'); 

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true
})); 


mongoose.connect(process.env.MONGODB)
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.log(err));

  app.use(session({
    secret: 'some secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB }),
    cookie: {
      sameSite: 'Lax',
      secure: false,
    }
  }));

  // app.use(session({
  //   secret: 'some secret',
  //   resave: false,
  //   saveUninitialized: false,
  //   store: MongoStore.create({ mongoUrl: process.env.MONGODB }),
  //   cookie: {
  //     sameSite: 'None',
  //     secure: process.env.NODE_ENV === 'production' ? true : false,
  //   }
  // }));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

// passport.serializeUser(function(user, cb) {
//   cb(null, user.id);
// });

// passport.deserializeUser(function(id, cb) {
//   User.findById(id, function(err, user) {
//     cb(err, user);
//   });
// });

app.set('view engine', 'ejs');

app.use('/users', usersRouter);

app.get('/login', (req, res) => {
  res.render('index');
});



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});