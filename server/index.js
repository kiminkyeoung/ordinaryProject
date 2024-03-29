const express = require('express');
const consola = require('consola');
const { Nuxt, Builder } = require('nuxt');
const app = express();
const passport = require('passport');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
// Import and Set Nuxt.js options
const config = require('../nuxt.config.js');
config.dev = !(process.env.NODE_ENV === 'production');

var MySQLStore = require('express-mysql-session')(session);
//var dbConfig = require('../config/dbConfig.js');

const path = require('path');

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config);

  const { host, port } = nuxt.options.server;
  const port_2 = 3001;
  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build()
  } else {
    await nuxt.ready()
  }
 
  app.use(flash());

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended : true}));

  app.use(passport.initialize());
  app.use(passport.session());
  
  app.use(function(req, res, next) {
    app.locals.isLogin = req.isAuthenticated();
    app.locals.userData = req.user; 
    next();
  });

  // Give nuxt middleware to express
  app.use(nuxt.render);

  // Listen the server
  app.listen(port_2, host);
  consola.ready({
    message: `Server listening on http://${host}:${port_2}`,
    badge: true
  })
}
start();
