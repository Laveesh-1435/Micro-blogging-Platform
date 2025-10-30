const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const session = require('express-session');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const MongoStore = require('connect-mongo');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables

const authRoutes = require('./api/apiRoutes');
const errorHandler = require('./middlewares/errorHandler');
const logger = require('./middlewares/logger');
const auth = require('./middlewares/auth');
const User = require('./models/User'); // Make sure you have the correct User model

const app = express();
const PORT = process.env.PORT || 8000;

// MongoDB Atlas Connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log('✅ Connected to MongoDB Atlas'))
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
app.use(cors({origin:'http://localhost:8000'})); // Modify as per your frontend URL
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

const mockData = require('./mockData');
const { mockUser, mockBookmarks, trends, suggestions, mockTrends, mockFollowSuggestions } = require('./mockData');
// Routes
app.get('/', async (req, res) => {
  // Fetch user data from session (example)
  const user = await User.findById(req.session.userId); // assuming session stores userId
  res.render('dashboard', {
     user: mockData.userData,
    flitts: mockData.flittsData,
    trends: mockData.trendsData,
    suggestions: mockData.suggestionsData
     // Replace mockSuggestions with real data
  });
});
app.get('/dashboard', (req, res) => {
  // Pass the mock data to the template
  res.render('dashboard', {
    user: mockData.userData,
    flitts: mockData.flittsData,
    trends: mockData.trendsData,
    suggestions: mockData.suggestionsData
  });
});

app.get('/bookmarks', (req, res) => {
    res.render('bookmark', { 
        user: mockUser,
        bookmarks: mockBookmarks,
        trends: mockTrends,
        suggestions: mockFollowSuggestions
    });
});
// Profile route
app.get('/profile', (req, res) => {
    res.render('profile', {
        user: mockUser,
        trends,
        suggestions
    });
});


app.get('/register', (req, res) => {
  const errorMessage = req.query.error || null;
  res.render('register', { error: errorMessage });
});

// Session Test Route
app.get('/session-test', (req, res) => {
  if (!req.session.views) {
    req.session.views = 1;
  } else {
    req.session.views++;
  }
  res.render('session-test', { views: req.session.views });
});

// Authentication routes
app.use('/api', authRoutes);

// Static files setup
app.use(express.static('public'));

// Login and Logout routes
app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/logout', (req, res) => {
  req.session.destroy(); // End the session
  res.redirect('/login');
});

// Error handling middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
