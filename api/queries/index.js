const fs = require('fs');
const path = require('path');
const util = require('util');
const readFileAsync = util.promisify(fs.readFile);

const USERS = require('../data/users.json');
const RESTAURANTS = require('../data/restaurants.json');
const dataFile = path.join(__dirname, '../data/waiter-table.json');

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

module.exports.getAssignments = _getAssignments;

module.exports.getAssignmentForWaiter = (waiter) => {
    return _getAssignments().then(records => {
        let assigned = records.filter(rec => rec.username === waiter)
            .map(rec => {
                // retrieve restaurant name
                let restaurant = RESTAURANTS.find(r => r.id === rec.restaurantId);

                return { 
                    table: rec.table, 
                    restaurant: restaurant.name 
                };
            });

        return { waiter, assigned };
    });
};


/// private functions

function _getAssignments() {
    return readFileAsync(dataFile, {encoding: 'utf8'})
        .then(content => {
            return JSON.parse(content);
        });
}
