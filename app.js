require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 7003;
const hbs = require('hbs');
const cookieparser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');

//static files
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public-2'));
app.use(express.static(__dirname + '/public-about'));
app.use(express.static(__dirname + '/public-achievement'));
app.use(express.static(__dirname + '/public-gallery'));
app.use(express.static(__dirname + '/public-team'));
app.use(express.static(__dirname + '/public-main'));
app.use(express.static(__dirname + '/pdf    '));

//use
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieparser());

app.use(
  session({
    secret: 'testsession',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: null },
  })
);

app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

// views
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

//router
const router = require('./router/router');

app.use('/', router);

app.listen(port, () => {
  console.log(`app is run at http://localhost:${port}`);
});
