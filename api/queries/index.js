const fs = require('fs');
const path = require('path');
const util = require('util');
const readFileAsync = util.promisify(fs.readFile);

const USERS = require('../data/users.json');
const RESTAURANTS = require('../data/restaurants.json');
const dataFile = path.join(__dirname, '../data/waiter-table.json');

module.exports = {
    findUser,
    getAllUsers,
    getWaiters,
    getRestaurants,
    getAssignments,
    getAssignmentDetails,
    getAssignmentForWaiter
};

/**
 * FUNCTIONS - each of the following function return Promise
 * If we have to replace *.json with real database calls it will not break
 * client code.
 */

function getWaiters () {
    let waiters = USERS.filter(user => !user.is_manager)
        .map(user => {
            return { username: user.username, name: user.name };
        });    
    return Promise.resolve(waiters);
};

function findUser (username) {
    let user = USERS.find(user => user.username == username);
    return Promise.resolve(user);
};

function getRestaurants() {
    return Promise.resolve(RESTAURANTS);
};

function getAllUsers () {
    let waiters = USERS.map(user => {
            return { username: user.username, name: user.name };
        });
    return Promise.resolve(waiters);
};

/**
 * Waiter table assignment projection
 * @returns {array} tables that are unique to one restaurant with their corresponding waiters
 */
function getAssignmentDetails() {
    let restaurants = RESTAURANTS.map(rest => {
        return {
            restaurantId: rest.id,
            name: rest.name,
            tables: rest.tables.map(tbl => {
                return { name: tbl, waiter: "Unassigned" }
            })
        }
    });

    return getAssignments().then(assignments => {
        (assignments || []).forEach(assignment => {
            let restaurant = restaurants.find(rest => rest.restaurantId == assignment.restaurantId);
            if (!restaurant) return;

            let table = restaurant.tables.find(tbl => tbl.name == assignment.table);
            if (!table) return;

            table.waiter = USERS.find(usr => usr.username == assignment.username).name;
        });
        
        return restaurants;
    });
}

/**
 * Retrieve raw assignment 
 * @returns {array}
 */
function getAssignments() {
    return readFileAsync(dataFile, {encoding: 'utf8'})
        .then(content => {
            return JSON.parse(content);
        });
};

/**
 * Retrieve table allotments for a particular waiter
 * @param {string} waiter 
 * @returns {object} Returns an object { waiter: string, assigned: [{ restaurant: string, tables: [...] }]}
 */
function getAssignmentForWaiter(waiter) {
    return getAssignments().then(records => {
        let assignments = [];
        
        records.filter(rec => rec.username === waiter).forEach(rec => {
            let assigned = assignments.find(assign => assign.restaurantId == rec.restaurantId);
            if (!assigned) {
                let restaurant = RESTAURANTS.find(r => r.id === rec.restaurantId);
                assigned = { 
                    restaurantId: restaurant.id, 
                    restaurant: restaurant.name, 
                    tables: [rec.table] 
                };
                assignments.push(assigned);
            } else {
                assigned.tables.push(rec.table);
            }
        });

        return { waiter, assigned: assignments };
    });
};
