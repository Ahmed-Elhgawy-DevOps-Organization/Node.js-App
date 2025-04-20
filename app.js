require('dotenv').config();  // Load environment variables
const express = require('express');
const basicAuth = require('basic-auth');
const app = express();

// Middleware for Basic Auth
function checkAuth(req, res, next) {
  const credentials = basicAuth(req);

  if (!credentials || credentials.name !== process.env.USERNAME || credentials.pass !== process.env.PASSWORD) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Access to the secret message"');
    return res.status(401).send('Authentication required');
  }

  next();  // If authentication passes, proceed to the route handler
}

// / route - returns Hello, world!
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// /secret route - protected by Basic Auth
app.get('/secret', checkAuth, (req, res) => {
  res.send(process.env.SECRET_MESSAGE);
});

// Export the app so it can be used for testing
module.exports = app;
