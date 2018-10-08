const { NODE_ENV } = process.env;

const config = {
  development: {
    environment: 'development',
    secret: process.env.TOKEN_SECRET || 'kksisikjweiujedmk',
    isTest: false,
    server: {
      port: 3000,
      host: 'localhost'
    },
    bodyParser: {
      extended: true
    }
  }
};
module.exports = config[NODE_ENV || 'development'];
