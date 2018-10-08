import jwt from 'jsonwebtoken';
import { secret as tokenMessage } from '../config';

function checkTokenSetUser(req, res, wat) {
  const tokenHeader = req.get('Authorization');
  if (tokenHeader) {
    const token = tokenHeader.split(' ')[1];
    console.log(token);
    jwt.verify(token, tokenMessage, (err, decoded) => {
      if (err) {
        wat();
      } else {
        console.log(decoded);
        req.user = decoded;
        wat();
      }
    });
  } else {
    wat();
  }
}

function ensureLoggedIn(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.status(401).json({ error: 'Usuario no valido' });
  }
}

function allowAccess(req, res, next) {
  if (req.user.id == req.params.id) {
    next();
  } else {
    res.status(401);
    next(new Error('Un-Authorized'));
  }
}

module.exports = {
  ensureLoggedIn,
  allowAccess,
  checkTokenSetUser
};

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
