import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { secret as tokenMessage } from '../config';
// const tokenMessage = config.secret;

module.exports = (app, database) => {
  function validUser(user) {
    return (
      typeof user.email == 'string' &&
      user.email.trim() != '' &&
      typeof user.userName == 'string' &&
      user.userName.trim() != '' &&
      typeof user.password == 'string' &&
      user.password.trim() != '' &&
      user.password.trim().length >= 5
    );
  }
  function validLoggingUser(user) {
    return (
      typeof user.userName == 'string' &&
      user.userName.trim() != '' &&
      typeof user.password == 'string' &&
      user.password.trim() != '' &&
      user.password.trim().length >= 5
    );
  }

  app.post('/api/sgin-up', (request, response) => {
    const newUser = request.body;
    const isValid = validUser(newUser);
    if (isValid) {
      database('users')
        .where('userName', newUser.userName)
        .orWhere('email', newUser.email)
        .select()
        .then(user => {
          if (user.length) {
            response.status(400).json({
              error: `${newUser.userName} or ${newUser.email} already exists`
            });
          } else {
            bcrypt.hash(newUser.password, 10).then(hash => {
              newUser.password = hash;
              database('users')
                .insert(newUser, 'id')
                .then(createdUser => {
                  jwt.sign(
                    {
                      id: createdUser[0]
                    },
                    tokenMessage,
                    { expiresIn: '1h' },
                    (err, token) => {
                      console.log('err', err);
                      console.log('token', token);
                      response.status(201).json({
                        id: createdUser[0],
                        token,
                        message: 'ok'
                      });
                    }
                  );
                  // response.status(201).json({ id: createdUser[0] });
                })
                .catch(error => {
                  response.status(500).json({ error });
                });
            });
          }
        })
        .catch(error => {
          response.status(500).json({ error });
        });
    } else {
      response.status(400).json({ error: 'Usuario no valido' });
    }
  });

  app.post('/api/login', (req, res, next) => {
    const loggingUser = req.body;
    if (validLoggingUser(loggingUser)) {
      database('users')
        .where('userName', loggingUser.userName)
        .orWhere('email', loggingUser.userName)
        .select()
        .then(user => {
          if (user.length) {
            bcrypt
              .compare(loggingUser.password, user[0].password)
              .then(result => {
                if (result) {
                  jwt.sign(
                    {
                      id: user.id
                    },
                    tokenMessage,
                    { expiresIn: '1h' },
                    (err, token) => {
                      console.log('token', token);
                      res.json({
                        id: user[0].id,
                        token,
                        message: 'ok'
                      });
                    }
                  );
                }
              });
          } else {
            response.status(401).json({ error: 'Usuario no valido' });
          }
        });
    } else {
      response.status(401).json({ error: 'Usuario no valido' });
    }
  });
};
