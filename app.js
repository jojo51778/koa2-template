const Koa = require('koa')
const bodyParser = require('koa-bodyparser')()
const static = require('koa-static')
const cors = require('@koa/cors')
const helmet = require('koa-helmet')
const jwt = require('koa-jwt')

const { loggerMiddleware } = require('./src/middlewares/logger')
const router = require('./src/routes')
const { corsHandler } = require('./src/middlewares/cors')
const constants = require('./config/constants')

const app = new Koa()

// logger
app.use(loggerMiddleware)

app.use(bodyParser)
app.use(static(__dirname + 'public'))

app.use(helmet())

app.use(cors(corsHandler))

// jwt验证
app.use(function(ctx, next){
  return next().catch((err) => {
    if (401 == err.status) {
      ctx.status = 401;
      ctx.body = 'Protected resource, use Authorization header to get access\n';
    } else {
      throw err;
    }
  });
});
app.use(jwt({ secret: constants.secret }).unless({
  path: [
    '/api/login',
    '/api/register'
  ]
}))

app.use(router.routes(), router.allowedMethods())




app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

app.listen(3000,() => {
  console.log('服务启动在3000端口')
})