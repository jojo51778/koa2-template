const { Sequelize } = require('sequelize')
const db = require('../../config/db')

const sequelize = new Sequelize(db.mysql.database, db.mysql.user, db.mysql.password || null, {
  host: db.mysql.host,
  port: db.mysql.port,
  dialect: 'mysql',
  pool: {
    max: db.mysql.connectionLimit,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  // timezone: '+8:00'
})

sequelize
  .authenticate()
  .then(() => {
    console.log('数据库连接成功')
  })
  .catch((err) => {
    console.error(err)
    throw err
  })

module.exports = sequelize