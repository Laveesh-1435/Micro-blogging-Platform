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
            author: req.session.user._id, // FIXED: Changed this from userId to author
            timePosted: new Date().toLocaleString()
        });

        await newPost.save();
        
        res.redirect('/dashboard'); 
    } catch (error) {
        console.error("❌ Error saving post:", error);
        res.status(500).send("Server Error while saving post");
    }
};