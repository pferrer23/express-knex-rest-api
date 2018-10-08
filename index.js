import express from 'express';
import consign from 'consign';
import config from './config.js';
import knexConfig from './knexfile';
import knex from 'knex';
import bodyParser from 'body-parser';
import jwtMid from 'express-jwt';
// import cookieParser from 'cookie-parser';
import tokens from './auth/tokens.js';
const app = express();
const environment = process.env.NODE_ENV || 'development';
const tokenMessage = process.env.TOKEN_SECRET || 'kksisikjweiujedmk';
const configuration = knexConfig[environment];
const database = knex(configuration);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
// require('dotenv').config();
// app.use(cookieParser());
// Secure "protected" endpoints with JWT middleware

app.use(tokens.checkTokenSetUser);
app.use('/api/v1', tokens.ensureLoggedIn);
// app.use(
//   '/api/v1',
//   jwtMid({
//     secret: tokenMessage, // Use the same token that we used to sign the JWT above
//     // Let's allow our clients to provide the token in a variety of ways
//     getToken: function(req) {
//       if (
//         req.headers.authorization &&
//         req.headers.authorization.split(' ')[0] === 'Bearer'
//       ) {
//         // Authorization: Bearer g1jipjgi1ifjioj
//         // Handle token presented as a Bearer token in the Authorization header
//         return req.headers.authorization.split(' ')[1];
//       } else if (req.query && req.query.token) {
//         // Handle token presented as URI param
//         return req.query.token;
//       } else if (req.cookies && req.cookies.token) {
//         // Handle token presented as a cookie parameter
//         return req.cookies.token;
//       }
//       // If we return null, we couldn't find a token.
//       // In this case, the JWT middleware will return a 401 (unauthorized) to the client for this request
//       return null;
//     }
//   })
// );
app.use(function(err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send({ error: 'invalid token...' });
  }
});

consign(config.consign)
  .include('routes')
  .then('auth')
  .into(app, database);

app.listen(config.server.port, function() {
  console.log('listening on 3000');
});
