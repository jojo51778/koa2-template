const fs = require('fs')
const path = require('path')
const log4js = require('log4js')
const log4jsConfig = require('../../config/log4js')

log4js.configure(log4jsConfig)

const logger = log4js.getLogger('default')
const http = log4js.getLogger('http')

const loggerMiddleware = async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start

  const code = ctx.body.code;
  const remoteAddress = ctx.headers['x-forwarded-for'] || ctx.ip || ctx.ips ||
    (ctx.socket && (ctx.socket.remoteAddress || (ctx.socket.socket && ctx.socket.socket.remoteAddress)))
  let logText = `
    ${ctx.method}
    ${ctx.status} 
    ${ctx.url} 
    请求参数： ${JSON.stringify(ctx.request.body)} 
    响应参数： ${JSON.stringify(ctx.body)}
    ${remoteAddress}
    ${ms}ms`
  // 根据状态码，进行日志类型区分
  if (code >= 500) {
    logger.error(logText);
  } else if (code >= 400) {
    logger.warn(logText);
  } else {
    http.info(logText);
    logger.log(logText);
  }
}

module.exports = {
  logger,
  loggerMiddleware
}