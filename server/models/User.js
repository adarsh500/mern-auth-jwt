const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const { emit } = require('nodemon');
const { use } = require('../routes/authRoutes');
const { isEmail } = validator;

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 4,
  },
});

userSchema.statics.signup = async function (email, password) {
  console.log('stta', email, password);

  if (!validator.isEmail(email)) {
    throw Error('invalid email');
  }

  //uncomment these lines before pushing to prod
  //   if (!validator.isStrongPassword(password)) {
  //     throw Error('Password not strong enough');
  //   }

  const userExists = await this.findOne({ email });

  if (userExists) {
    throw Error('Email already registered');
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ email, password: hash });
  return user;
};

userSchema.statics.login = async function (email, password) {
    
};

module.exports = mongoose.model('User', userSchema);
