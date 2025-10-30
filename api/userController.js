const User = require('../models/User'); // Import the User model

// Register a new user
exports.register = async (req, res) => {
  const { username, password, email } = req.body;

  try {
    // Ensure that email is provided (if using email)
    if (!email) {
      return res.redirect('/register?error=emailRequired');
    }

    // Check if the user or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.redirect('/register?error=exists'); // Redirect if the user or email already exists
    }

    // Create a new user and save to database
    const newUser = new User({ username, password, email });
    await newUser.save();

    res.redirect('/login?registered=true'); // Redirect to login after successful registration
  } catch (error) {
    console.error('❌ Error registering user:', error);
    res.redirect('/register?error=server'); // Redirect with error if registration fails
  }
};

// Login an existing user
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username }); // Find user by username

    if (!user) {
      return res.redirect('/login?error=userNotFound'); // Redirect if user is not found
    }

    // Compare the entered password with the stored hashed password
    const isPasswordValid = await user.comparePassword(password);

    if (isPasswordValid) {
      req.session.user = user; // Store user in session
      res.redirect('/dashboard'); // Redirect to dashboard if login is successful
    } else {
      res.redirect('/login?error=invalidPassword'); // Redirect if password is invalid
    }
  } catch (error) {
    console.error('❌ Error during login:', error);
    res.redirect('/login?error=server'); // Redirect with error if login fails
  }
};

// Logout the user
exports.logout = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error('❌ Error destroying session:', err);
        return res.redirect('/login?error=logout'); // Redirect if session destruction fails
      }

      console.log('✅ User logged out successfully');
      res.redirect('/login'); // Redirect to login after logout
    });
  } catch (error) {
    console.error('❌ Error during logout:', error);
    res.redirect('/login?error=server'); // Redirect if logout fails
  }
};
