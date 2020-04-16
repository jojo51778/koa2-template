const config = {
  mysql: {
    port: 3306,
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'koa_demo', // 库名
    connectionLimit: 10, // 连接限制
  }
}
module.exports = config