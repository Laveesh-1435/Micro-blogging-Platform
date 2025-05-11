require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');

// Import mock data 
const mockData = require('./mockData');

const authRoutes = require('./api/apiRoutes');
const errorHandler = require('./middlewares/errorHandler');
const logger = require('./middlewares/logger');

const app = express();
const PORT = process.env.PORT || 8080;

// Set up EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Dashboard route using imported mock data
app.get('/dashboard', (req, res) => {
  // Pass the mock data to the template
  res.render('dashboard', {
    user: mockData.userData,
    flitts: mockData.flittsData,
    trends: mockData.trendsData,
    suggestions: mockData.suggestionsData
  });
});

// app.get('/profile', (req, res) => {
//   // Get user data from wherever you store it (session, database, etc.)
//   const user= {
//     name: 'Manthan',
//     handle: 'manthan',
//     // other user properties
//   };
  
//   res.render('profile', { user });
// });

// app.get("/profile", (req, res) => {
//   res.render("profile");  // This will render 'views/profile.ejs'
// });
// app.get('/profile', (req, res) => {
//   const user = {
//     name: 'Manthan',
//     handle: 'manthan',
//     flitts: [],
//     verified: true,
//     bio: "Developer | Tech Enthusiast",
//     location: "Mumbai, India",
//     website: "https://manthan.dev",
//     joinDate: "January 2025",
//     following: 120,
//     followers: 200
//   };
  
//   res.render('profile', { user, currentUser: user, suggestions: [], trends: [] });
// });

app.get('/profile', (req, res) => {
  // Pass the mock data to the template
  res.render('profile', {
    user: mockData.userData,
    flitts: mockData.flittsData,
    trends: mockData.trendsData,
    suggestions: mockData.suggestionsData
  });
});


// Middleware
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
app.use(cors({origin:'http://localhost:8000/login'}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.get('/session-test', (req, res) => {
  if (!req.session.views) {
      req.session.views = 1;
  } else {
      req.session.views++;
  }
  res.render('session-test', { views: req.session.views });
});

// Custom middlewares
app.use(logger);

// Routes
app.use('/api', authRoutes);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Route handlers using EJS templates
app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.get('/logout', (req, res) => {
  // Clear session if needed
  req.session.destroy();
  res.redirect('/login');
});

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

app.use(express.static('public', {
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));
module.exports = app;