export default {
  isTest: true,
  server: {
    port: 3000,
    host: 'localhost'
  },
  bodyParser: {
    extended: true
  },
  knex: {
    client: 'sqlite3',
    connection: {
      database: 'express_sequelize_test',
      filename: './express_sequelize.sqlite'
    },
    useNullAsDefault: true
  },
  model: {
    schema: {
      unknownProperties: 'delete'
    }
  },
  consign: {
    verbose: false
  }
};
