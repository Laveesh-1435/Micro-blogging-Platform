const fs = require('fs').promises;
const path = require('path');

module.exports = async (req, res, next) => {
    const logEntry = {
        timestamp: new Date().toISOString(),
        method: req.method,
        path: req.path,
        ip: req.ip
    };

    try {
        const logDir = path.join(__dirname, '..', 'logs');
        await fs.mkdir(logDir, { recursive: true });

        const logFile = path.join(logDir, 'server.log');
        await fs.appendFile(logFile, JSON.stringify(logEntry) + '\n');
    } catch (error) {
        console.error('Logging failed:', error);
    }

    next();
};
