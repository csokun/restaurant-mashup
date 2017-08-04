const fs = require('fs');
const path = require('path');
const util = require('util');
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

module.exports.assign = (assignments) => {

    return new Promise((resolve, reject) => {
        let filename = path.join(__dirname, '../data/waiter-table.json');

        readFileAsync(filename, {encoding: 'utf8'})
            .then(content => {
                let existingAssignments = JSON.parse(content);
                let accept = true;

                (assignments || []).forEach(assignment => {
                    if (!accept) return;
                    
                    let count = existingAssignments.filter(rec => {
                        return rec.username === assignment.username && rec.restaurantId == assignment.restaurantId;
                    }).length;

                    if (count >= 4) {
                        accept = false;
                    } else {
                        // last strike win - filter out existing assignment
                        existingAssignments = existingAssignments
                            .filter(rec => !(rec.restaurantId == assignment.restaurantId && rec.table == assignment.table));

                        existingAssignments.push(assignment);
                    }
                });
                
                if (!accept) {
                    return reject("You cannot assign more than 4 tables to a waiter in a single restaurant");
                }

                let updated = JSON.stringify(existingAssignments, null, 2);

                writeFileAsync(filename, updated, 'utf8')
                    .then(result => {
                        resolve();
                    }).catch(error => reject);

            }).catch(error => reject);
    });
        
}
