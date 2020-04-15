const Koa = require('koa')
const bodyParser = require('koa-bodyparser')()
const static = require('koa-static')
const cors = require('@koa/cors')
const helmet = require('koa-helmet')

const config = require('./config')
const { corsHandler } = require('./middlewares/cors')

const app = new Koa()

app.use(bodyParser)
app.use(static(config.publicDir))

app.use(helmet())

app.use(cors(corsHandler))

app.use(async ctx => {
  ctx.body = ctx.request.body
})

app.listen(3000,() => {
  console.log('服务启动在3000端口')
})