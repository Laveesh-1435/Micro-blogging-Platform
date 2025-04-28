module.exports = (req, res, next) => {
    const { username, password } = req.body;

    if (req.path === '/register' || req.path === '/login') {
        if (!username || !password) {
            return res.status(400).send('Username and password are required');
        }
    }

    next();
};
