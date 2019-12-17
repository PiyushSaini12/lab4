const express = require('express');
const userController = require('./controllers/userController');
const authController = require('./controllers/authController');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();

const mongoose = require('mongoose');

mongoose.connect(
  'mongodb+srv://PiyushSaini:Starstruck$09@cluster0-dzwtv.mongodb.net/test?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true },
);

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: 'test',
    resave: true,
    saveUninitialized: false,
  }),
);

app.use(passport.initialize());
app.use(passport.session());

const User = require('./models/User');

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/', authController.isLoggedIn, userController.home);
app.get('/register', userController.registerForm);
app.post('/register', userController.register, authController.login);

app.get('/login', userController.loginForm);
app.post('/login', authController.login);

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

const server = app.listen(3000);

const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('New user connected');

  /* default username */
  socket.username = 'Anonymous';

  /* We also will listen to any call made in « change_username.
    If a message is sent to this event, the username will be changed. */
  socket.on('change_username', (data) => {
    socket.username = data.username;
  });

  /* listen on new message */
  socket.on('new_message', (data) => {
    /* broadcast the new message */
    io.sockets.emit('new_message', {
      message: data.message,
      username: socket.username,
    });
  });
});
