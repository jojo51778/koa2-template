const corsHandler = {
  origin: function (ctx) {
    if(ctx.url === '/test') {
      // 配置不可以跨域接口地址
      return false
    }
    return '*'
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept']
}

module.exports = {
  corsHandler
}