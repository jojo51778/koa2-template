const crypto = require('crypto')

// 加盐
module.exports = {
  makeSalt() {
    return crypto.randomBytes(3).toString('base64')
  },
  encryptPassword(password, salt) {
    if(!password || !salt) {
      return ''
    }
    const tempSalt = Buffer.from(salt, 'base64')
    return (
      crypto.pbkdf2Sync(password, tempSalt, 10000, 16, 'sha1').toString('base64')
    )
  }
}