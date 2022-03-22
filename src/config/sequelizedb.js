const Sequelize = require('sequelize');

module.exports = new Sequelize('dtr-dev-db-01', 'dtrdbadmin', 'x57segb387gb3470', {
    host: 'direct2resort-do-user-8143714-0.b.db.ondigitalocean.com',
    dialect: 'mysql',
    port: 25060,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});
