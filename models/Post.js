const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  content: { 
    type: String, 
    required: true, 
    maxlength: 280 // Limit characters like a typical micro-blog
  },
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // References your User model
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  replies:{
    type: Array,
    default: []
  },
  likes:{
    type: Array,
    default: []
  },
  reflitts:{
    type: Array,
    default: []
  }
});

module.exports = mongoose.model('Post', postSchema);