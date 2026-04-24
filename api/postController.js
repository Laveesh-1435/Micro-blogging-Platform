const Post = require('../models/Post');

exports.createPost = async (req, res) => {
  try {
    const { content } = req.body;

    // Check if the user is authenticated via session
    if (!req.session.user) {
      return res.redirect('/login');
    }

    // Create and save the new post
    const newPost = new Post({
      content: content,
      author: req.session.user._id // Link post to the logged-in user
    });

    await newPost.save();

    // Redirect back to the dashboard so the user sees their new post
    res.redirect('/dashboard'); 
  } catch (error) {
    console.error('❌ Error creating post:', error);
    res.status(500).send('Server Error while creating post');
  }
};