const Router = require('@koa/router')
const router = new Router()
const controller = require('../controllers')

router.prefix('/api')

router.get('/', async (ctx, next) => {
  ctx.body = 'hello jojo'
})
.post('/register', controller.user.register) //注册
.post('/login', controller.user.login) //登录

module.exports = router