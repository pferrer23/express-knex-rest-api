import jwt from 'jsonwebtoken';
const tokenMessage = process.env.TOKEN_SECRET || 'kksisikjweiujedmk';
// require('dotenv').config();

function checkTokenSetUser(req, res, wat) {
  const tokenHeader = req.get('Authorization');
  if (tokenHeader) {
    const token = tokenHeader.split(' ')[1];
    console.log(token);
    jwt.verify(token, tokenMessage, (err, decoded) => {
      if (err) {
        res.status(401).json({ error: 'Usuario no valido' });
      } else {
        console.log(decoded);
        req.user = decoded;
        wat();
      }
    });
  } else {
    res.status(401).json({ error: 'Usuario no valido' });
  }
}

function ensureLoggedIn(req, res, next) {
  console.log(req.user.id);
  if (req.user) {
    // console.log('next');
    next();
  } else {
    // console.log('error
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
