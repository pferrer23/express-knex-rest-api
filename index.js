import express from 'express';
import consign from 'consign';
import config from './config.js';
import knexConfig from './knexfile';
import knex from 'knex';
import bodyParser from 'body-parser';
import tokens from './auth/tokens.js';

const app = express();
const environment = config.environment || 'development';
const configuration = knexConfig[environment];
const database = knex(configuration);

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());
// app.use(cookieParser());

app.use(tokens.checkTokenSetUser);
app.use('/api/v1', tokens.ensureLoggedIn);

app.use(function(err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send({ error: 'invalid token...' });
  }
});

consign(config.consign)
  .include('routes')
  .into(app, database);

app.listen(config.server.port, function() {
  console.log('listening on 3000');
});
