const Post = require('../models/Post'); 

exports.createPost = async (req, res) => {
    try {
        console.log("🟢 1. Post route was hit!");
        console.log("🟢 2. Session Data:", req.session);
        console.log("🟢 3. Form Data Received:", req.body);

        const { content } = req.body;
        
        // Ensure you are using 'author' to match your Mongoose Schema
        const newPost = new Post({
            content: content,
            author: req.session.user._id
        });

        await newPost.save();
        
        res.redirect('/dashboard'); 
    } catch (error) {
        console.error("❌ Error saving post:", error);
        res.status(500).send("Server Error while saving post");
    }
};

exports.deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        
        // Find the post and ensure the logged-in user is the author
        const post = await Post.findOne({ _id: postId });
        
        if (!post) {
            return res.status(404).send('Post not found');
        }
        
        // Verify ownership (convert both to strings to match safely)
        if (post.author.toString() !== req.session.user._id.toString()) {
            return res.status(403).send('Unauthorized to delete this post');
        }

        // Delete from database
        await Post.findByIdAndDelete(postId);
        
        // Redirect back to the page they were on (Dashboard or Profile)
        res.redirect('back');
    } catch (error) {
        console.error("❌ Error deleting post:", error);
        res.status(500).send("Server Error");
    }
};