const { User, sequelize } = require('../models')
const { decode } = require('../helpers/bcrypt');
const { sign } = require('../helpers/jwt')

class UserController {
  // login user
  static async login (req, res) {
    const { email, password } = req.body
    try {
      const foundUser = await User.findOne({where: {email}})
      if (!foundUser) {
        res.status(401).json({message: 'Invalid Email/Password'})
      } else {
        const isMatch = decode(password, foundUser.password)
        if(!isMatch) {
          res.status(401).json({message: 'Invalid Email/Password'})
        } else {
          const access_token = sign({
            id: foundUser.id,
            email: foundUser.email
          })
          res.status(200).json({
            id: foundUser.id,
            email: foundUser.email,
            access_token: access_token
          })
        }
      }
    } catch (error) {
      if(error.name === 'SequelizeValidationError') {
        error = error.errors.map((err) => err.message)
        res.status(400).json(error)
      } else {
        res.status(500).json({message: 'Internal server error'})
      }
    }
  }
  // register
  static async register (req, res) {
    const { username, email, password, age, gender, photo, about } = req.body
    const t = await sequelize.transaction()
    try {
      const foundUser = await User.findOne({where: {email}})
      if(foundUser) {
        res.status(400).json({message: 'Email is already exist'})
      } else {
        const newUser = await User.create({username, email, password, age, gender, photo, about}, {transaction: t})
        await t.commit()
        res.status(200).json({
          id: newUser.id,
          email: newUser.email
        })
      }
    } catch (error) {
      await t.rollback()
      if(error.name === 'SequelizeValidationError') {
        error = error.errors.map((err) => err.message)
        res.status(400).json(error)
      } else {
        res.status(500).json({message: 'Internal server error'})
      }
    }
  }
}

module.exports = UserController