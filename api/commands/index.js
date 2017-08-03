const fs = require('fs');
const path = require('path');

module.exports.assign = (assignments) => {

    return new Promise((resolve, reject) => {
        
        let existingAssignments = fs.readFileSync(path.join(__dirname, '../data/waiter-table.json'));
    })


    fs.writeFileSync("/tmp/phraseFreqs.json", content, 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    }); 
}
