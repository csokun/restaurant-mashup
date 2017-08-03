const fs = require('fs');
const path = require('path');
const util = require('util');
const readFile = util.promisify(fs.readFile);

const USERS = require('../data/users.json');
const RESTAURANTS = require('../data/restaurants.json');

module.exports.findUser = (username) => {
    let user = USERS.find(user => user.username == username);
    return Promise.resolve(user);
};

module.exports.getAllUsers = () => {
    let waiters = USERS.map(user => {
            return { username: user.username, name: user.name };
        });
    return Promise.resolve(waiters);
};

module.exports.getWaiters = () => {
    let waiters = USERS.filter(user => !user.is_manager)
        .map(user => {
            return { username: user.username, name: user.name };
        });
    return Promise.resolve(waiters);
};

module.exports.getAssignments = () => {
    let filename = path.join(__dirname, '..', 'data', 'waiter-table.json');
    return readFile(filename).then(content => {
        return JSON.parse(content);
    });
}