const Sequelize = require('sequelize')
const sequelize = require('../database/sequelize')
const { makeSalt, encryptPassword } = require('../utils/cryptogram')
const jwt = require('jsonwebtoken');
const constants = require('../../config/constants')

module.exports = {
  async register(ctx, next) {
    const { accountName, realName, password, repassword, mobile } = ctx.request.body
    if(password !== repassword) {
      ctx.body = {
        code: 400,
        msg: '两次输入密码不一致'
      }
      return
    }
    const user = await findOne({username: accountName})
    if(user) {
      ctx.body = {
        code: 400,
        msg: '用户已存在'
      }
      return
    }
    const salt = makeSalt() //加盐
    const hashPwd = encryptPassword(password, salt) //加密密码
    const registerSQL = `
      INSERT INTO admin_user
        (account_name, real_name, passwd, passwd_salt, mobile, user_status, role, create_by)
      VALUES
        ('${accountName}', '${realName}', '${hashPwd}', '${salt}', '${mobile}', 1, 3, 0)
    `
    try {
      await sequelize.query(registerSQL, { logging: false })
      ctx.body = {
        code: 200,
        msg: 'Success'
      }
    } catch (error) {
      ctx.body = {
        code: '503',
        msg: `Service error: ${error}`,
      }
    }
  },
  async login(ctx, next){
    console.log('JWT验证 - Step 1: 用户请求登录');
    const { username, password} = ctx.request.body
    const authResult = await validateUser(username, password)
  
    switch (authResult.code) {
      case 1:
        return certificate(authResult.user, ctx);
      case 2:
        ctx.body = {
          code: 600,
          msg: `账号或密码不正确`,
        };
        return
      default:
        ctx.body = {
          code: 600,
          msg: `查无此人`,
        };
        return
    }
  }
}


async function findOne(ctx) {
  const { username } = ctx
  const sql = `
    SELECT
      user_id userId, account_name username, real_name realName, passwd password,
      passwd_salt salt, mobile, role
    FROM
      admin_user
    WHERE
      account_name = '${username}'
  `
  try {
    const user = (await sequelize.query(sql, {
      type: Sequelize.QueryTypes.SELECT,
      raw: true,
      logging: false,
    }))[0]
    return user
  } catch (error) {
    console.error(error)
    return undefined
  }
} 


async function validateUser(username, password) {
  console.log('JWT验证 - Step 2: 校验用户信息');
  const user = await findOne({username});
  if (user) {
    const hashedPassword = user.password;
    const salt = user.salt;
    // 通过密码盐，加密传参，再与数据库里的比较，判断是否相等
    const hashPassword = encryptPassword(password, salt);
    if (hashedPassword === hashPassword) {
      // 密码正确
      return {
        code: 1,
        user,
      };
    } else {
      // 密码错误
      return {
        code: 2,
        user: null,
      };
    }
  }
  // 查无此人
  return {
    code: 3,
    user: null,
  };
}

// JWT验证 - Step 3: 处理 jwt 签证
async function certificate(user, ctx) {
  const payload = { username: user.username, sub: user.userId, realName: user.realName, role: user.role };
  console.log('JWT验证 - Step 3: 处理 jwt 签证');
  try {
    const token = jwt.sign(payload, constants.secret);
    ctx.body = {
      code: 200,
      data: {
        token,
      },
      msg: `登录成功`,
    };
  } catch (error) {
    ctx.body = {
      code: 600,
      msg: `账号或密码错误`,
    };
  }
}