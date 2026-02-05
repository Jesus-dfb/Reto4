var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressLayouts = require('express-ejs-layouts'); // Importar el middleware de layouts
var session = require('express-session'); // Importar el middleware de sesión
const Database = require('./database/database'); // Importar la configuración de la base de datos

Database.getInstance('./database/database.db'); // Inicializar la base de datos

var auth = require('./middlewares/auth'); // Importar el middleware de autenticación

var indexRouter = require('./routes/index'); // traigo las rutas principales, para este ejercicio usaremos solo index.js

var app = express(); //a aprtir de aquí se configura el servidor

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({  // Configuración del middleware de sesión, para gestionar usuarios logueados
  secret : 'clave-secreta-cambiar-mas-adelante', 
  resave: false,
  saveUninitialized: false,
  cookie: {maxAge : 1000*60*60*24} 
}))

app.use(auth); // Usar el middleware de autenticación en todas las rutas

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
