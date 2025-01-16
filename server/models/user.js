const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    collection: 'customers', // collection name
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); 

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);  
    next(); 
  } catch (err) {
    next(err); 
  }
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);  
};

const User = mongoose.model('User', userSchema);

module.exports = User;
