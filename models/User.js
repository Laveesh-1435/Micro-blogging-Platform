const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Using bcryptjs for password hashing

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, default: '' },
  profilePic: { type: String, default: '/profile.jpg' },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  bio: { type: String, default: 'Hello, I am using Flitter!' },
  location: { type: String, default: '' },
  website: { type: String, default: '' },
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
