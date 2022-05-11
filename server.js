var express = require('express');
const db = require('./db');
var app = express();

app.locals.loggedIn = false;
app.locals.authmessage = "";

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// use res.render to load up an ejs view file

// index page
app.get('/', function(req, res) {
  if(!req.app.locals.loggedIn)
    res.redirect('/login');
  else
    res.render('pages/index');
});

// login page
app.get('/login', function(req, res) {
  if(!req.app.locals.loggedIn)
    res.render('pages/login');
  else
    res.redirect('/');
});

app.post('/login', function(req, res) {
   req.app.locals.authmessage = "";

    db.queryDB(db.con, "SELECT * FROM users WHERE username='"+req.body.username+"' AND password=md5('" + req.body.password +"')")
    .then((result) => {
      if (result.length == 1) {
        req.app.locals.loggedIn = true;
        if(result[0]['type'] == 'A')
          res.redirect('/admin');
        else if(result[0]['type'] == 'C')
          res.redirect('/');
        else
          res.redirect('/staff');
      } else {

        req.app.locals.authmessage = "Username or Password is Invalid";
        res.redirect('/login');
      }
    }).catch((err) => {
      req.app.locals.authmessage = "Could not connect to database";
      res.redirect('/login');
    });   
    
  });

// register page
app.get('/register', function(req, res) {
  if(!req.app.locals.loggedIn)
    res.render('pages/register');
  else
    res.redirect('/');
});

// register customer
app.post('/register', function(req, res) {
  req.app.locals.authmessage = "";
  if (req.body.password.length < 6) {
    req.app.locals.authmessage = "Password too short. Between 6 and 16 characters";
    res.redirect("/register");
  } else if (req.body.password != req.body.confirmpass) {
    req.app.locals.authmessage = "Passwords do not match";
    res.redirect("/register");
  } else {
    db.queryDB(db.con, "INSERT INTO users(name, username, email, password, type) VALUES  ('" + req.body.name + "', '" + req.body.username + "', '" + req.body.email + "', md5('" + req.body.password + "'), 'C')")
   .then((result) => {
    req.app.locals.authmessage = req.body.name + ", You have successfully registered. Login."
    res.redirect("/login");
   }).catch((err) => {
     if (err.errno == 1062) {
      req.app.locals.authmessage = "Username exists select another";
     } else {
      req.app.locals.authmessage = "Something went wrong";
     }    
    res.redirect("/register");
   });   
  }  
});

// logout page
app.get('/logout', function(req, res) {
  if(req.app.locals.loggedIn) {
    req.app.locals.loggedIn=false
    res.redirect('/');
  }  
});

// admin page
app.get('/admin', function(req, res) {
  if(!req.app.locals.loggedIn)
    res.redirect('/login');
  else
    res.render('pages/admin/index');
});

// admin page
app.get('/admin/registerstaff', function(req, res) {
  if(!req.app.locals.loggedIn)
    res.redirect('/login');
  else
    res.render('pages/admin/register');
});

// register staff
app.post('/admin/registerstaff', function(req, res) {
  req.app.locals.authmessage = "";
  if (req.body.password.length < 6) {
    req.app.locals.authmessage = "Password too short. Between 6 and 16 characters";
    res.redirect("/admin/registerstaff");
  } else if (req.body.password != req.body.confirmpass) {
    req.app.locals.authmessage = "Passwords do not match";
    res.redirect("/admin/registerstaff");
  } else {
    db.queryDB(db.con, "INSERT INTO users(name, username, email, password, type) VALUES  ('" + req.body.name + "', '" + req.body.username + "', '" + req.body.email + "', md5('" + req.body.password + "'), 'S')")
   .then((result) => {
    req.app.locals.authmessage = req.body.name + ", Staff successfully registered."
    res.redirect("/admin/registerstaff");
   }).catch((err) => {
     if (err.errno == 1062) {
      req.app.locals.authmessage = "Username exists select another";
     } else {
      req.app.locals.authmessage = "Something went wrong";
     }    
    res.redirect("/admin/registerstaff");
   });   
  }  
});

// staff page
app.get('/staff', function(req, res) {
  if(!req.app.locals.loggedIn)
    res.redirect('/login');
  else
    res.render('pages/staff/index');
});

var PORT = 8080;

// App listening on the below port
app.listen(PORT, function(err){
    if (err) console.log(err);
    db.connectDB(db.con);
    db.initDB(db.con);
    console.log("Server listening on PORT", PORT);
});

