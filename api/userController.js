const fs = require('fs').promises;
const { error } = require('console');
const path = require('path');

const USER_FILE = path.join(__dirname, '..', 'users.json');

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const usersData = await fs.readFile(USER_FILE, 'utf-8');
        const users = JSON.parse(usersData);

        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            req.session.user = user;
            res.redirect('/dashboard');  // ✅ Redirects to Dashboard
        } else {
            // Only use one response method, not both send() and redirect()
            res.redirect('/login?error=invalid');  // Redirect with error parameter
        }
    } catch (error) {
        console.error("❌ Server error during login:", error);
        res.redirect('/login?error=server');  // Redirect with server error parameter
    }
};

exports.register = async (req, res) => {
    const { username, password } = req.body;

    try {
        let users = [];

        // Read existing users file
        try {
            const usersData = await fs.readFile(USER_FILE, 'utf-8');
            users = JSON.parse(usersData);
        } catch (readError) {
            console.log("🔹 No existing users.json file found. Creating a new one.");
        }

        // Check if the username already exists
        const existingUser = users.find(u => u.username === username);
        if (existingUser) {
            return res.redirect('/register?error=exists');  // Redirect with error parameter
        }

        // Add the new user
        users.push({ username, password });

        // Write the updated users list back to users.json
        await fs.writeFile(USER_FILE, JSON.stringify(users, null, 2));

        console.log("✅ User registered successfully:", { username, password });

        res.redirect('/login?registered=true');  // Redirect with success parameter
    } catch (error) {
        console.error("❌ Error writing to users.json:", error);
        res.redirect('/register?error=server');  // Redirect with error parameter
    }
};

// Logout controller
exports.logout = async (req, res) => {
    try {
        // Destroy the user session
        req.session.destroy(err => {
            if (err) {
                console.error("❌ Error destroying session:", err);
                return res.redirect('/login?error=logout');  // Redirect with error parameter
            }
            
            console.log("✅ User logged out successfully");
            res.redirect('/login');  // Redirects to login page
        });
    } catch (error) {
        console.error("❌ Error during logout:", error);
        res.redirect('/login?error=server');  // Redirect with error parameter
    }
};