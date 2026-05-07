const Post = require('../models/Post');

exports.createPost = async (req, res) => {
  console.log("🟢 1. Post route was hit!"); 
  
  try {
    console.log("🟢 2. Session Data:", req.session); 

    if (!req.session.user) {
      console.log("🔴 ERROR: No user found in session. Redirecting to login.");
      return res.redirect('/login');
    }

    console.log("🟢 3. Form Data Received:", req.body);
    const { content } = req.body;

    if (!content) {
        console.log("🔴 ERROR: Content is empty! Check the HTML form.");
    }

    const newPost = new Post({
      content: content,
      // Note: Make sure your session stores the user object with an _id property
      author: req.session.user._id 
    });

    console.log("🟢 4. Attempting to save to MongoDB:", newPost);
    
    await newPost.save();
    
    console.log("✅ 5. Post successfully saved to database!");
    res.redirect('/dashboard');

  } catch (error) {
    console.error('❌ Error saving post:', error);
    res.status(500).send('Server Error while saving post.');
  }
};