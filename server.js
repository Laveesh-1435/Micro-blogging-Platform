const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const session = require('express-session');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const MongoStore = require('connect-mongo');
const dotenv = require('dotenv');
const Post = require('./models/Post');
const User = require('./models/User'); 
dotenv.config(); // Load environment variables

const authRoutes = require('./api/apiRoutes');
const errorHandler = require('./middlewares/errorHandler');
const logger = require('./middlewares/logger');
const auth = require('./middlewares/auth');

const app = express();
const PORT = process.env.PORT || 8000;

// MongoDB Atlas Connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// MongoDB Session Store
const store = MongoStore.create({
  mongoUrl: process.env.MONGODB_URI,
  collectionName: 'sessions'
});

// Middleware setup
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"]
    }
  }
}));
app.use(morgan('dev'));
app.use(cors({origin:'http://localhost:8000'})); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session setup with MongoDB store
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  store,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Set up EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ==========================================
// VIEW ROUTES (Now using live DB data)
// ==========================================

app.get(['/', '/dashboard'], async (req, res) => {
  try {
    // Protect dashboard from un-logged in users
    if (!req.session.user) {
      return res.redirect('/login');
    }

    /// Fetch posts...
    const posts = await Post.find().populate('author', 'username name profilePic').sort({ createdAt: -1 });

    // NEW: Fetch up to 5 users who are NOT the currently logged-in user
    const suggestedUsers = await User.find({ 
        _id: { $ne: req.session.user._id } 
    }).limit(5);

    res.render('dashboard', {
      user: req.session.user, 
      flitts: posts,          
      trends: [],             
      suggestions: suggestedUsers // Pass the database users here!
    });
  } 
  catch (error) {
    console.error('❌ Error fetching dashboard:', error);
    res.status(500).send('Server Error');
  }
});

app.get('/bookmarks', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  res.render('bookmark', { 
      user: req.session.user,
      bookmarks: [], // Replace with actual DB query when you build bookmark functionality
      trends: [],
      suggestions: []
  });
});

app.get('/profile', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  try {
    // Optional: Fetch only the posts made by the logged-in user for their profile
    const userPosts = await Post.find({ author: req.session.user._id }).sort({ createdAt: -1 });

    res.render('profile', {
        user: req.session.user,
        flitts: userPosts, // Pass their specific posts to the profile
        trends: [],
        suggestions: []
    });
  } catch (error) {
    console.error('❌ Error fetching profile:', error);
    res.status(500).send('Server Error');
  }
});

// ==========================================
// AUTH & UTILITY ROUTES
// ==========================================

app.get('/register', (req, res) => {
  const errorMessage = req.query.error || null;
  res.render('register', { error: errorMessage });
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/logout', (req, res) => {
  req.session.destroy(); // End the session
  res.redirect('/login');
});

app.use('/api', authRoutes);

// Session Test Route
app.get('/session-test', (req, res) => {
  if (!req.session.views) {
    req.session.views = 1;
  } else {
    req.session.views++;
  }
  res.render('session-test', { views: req.session.views });
});

// Static files setup
app.use(express.static('public'));

// Error handling middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;