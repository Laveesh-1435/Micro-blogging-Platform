const fs = require('fs').promises;
const path = require('path');

const USER_FILE = path.join(__dirname, '..', 'users.json');

class UserStorage {
    static async getUsers() {
        try {
            const data = await fs.readFile(USER_FILE, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    static async saveUser(user) {
        const users = await this.getUsers();
        users.push(user);
        await fs.writeFile(USER_FILE, JSON.stringify(users, null, 2));
    }
}

module.exports = UserStorage;
