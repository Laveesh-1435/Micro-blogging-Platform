const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Using bcryptjs for password hashing

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true }  // Ensure email is required and unique
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next(); // If password isn't modified, skip hashing

  // Hash the password
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare input password with stored hash
userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
