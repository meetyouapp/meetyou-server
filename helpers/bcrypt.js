const bcrypt = require('bcrypt')
const salt = 10

function encode(plainPassword) {
  return bcrypt.hashSync(plainPassword, salt)
}

function decode(plainPassword, hashedPassword) {
  return bcrypt.compareSync(plainPassword,hashedPassword)
}

module.exports = { encode, decode }