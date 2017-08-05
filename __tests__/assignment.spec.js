const expect = require('chai').expect;
const fs = require('fs');
const path = require('path');

const Command = require('../api/commands');
const Query = require('../api/queries');

const dataFile = path.join(__dirname, '..', 'api/data/waiter-table.json');

describe('Restaurant Management', () => {

    describe('Manager', () => {

        beforeEach(done => {
            // cleanup
            fs.writeFile(dataFile, '[]', 'utf8', (error) => {
                if (error) return done(error);
                done();
            });
        });

        it('should be able to assign tables to a waiter', (done) => {
            let assignments = [{ "username": "waiter1", "table": "Table 1", "restaurantId": 1 }];
            Command.assign(assignments)
                .then(result => {
                    Query.getAssignments().then(results => {
                        expect(results).to.have.lengthOf(1);
                        expect(results).to.deep.equal(assignments);
                        done();
                    });
                });
        });
        
        it('should be able to reassign table (last strike win)', (done) => {
            let assignments = [
                { "username": "waiter1", "table": "Table 1", "restaurantId": 1 },
                { "username": "waiter2", "table": "Table 1", "restaurantId": 1 }
            ];

            Command.assign(assignments)
                .then(result => {
                    Query.getAssignments().then(results => {
                        expect(results).to.have.lengthOf(1);
                        expect(results[0].username).to.equal('waiter2');
                        done();
                    });
                });
        });
        
        it('should not be able to assign more than 4 tables in any one restaurant', (done) => {
            let assignments = [];
            for (i = 0; i < 5; i++) {
                assignments.push({
                    "username": "waiter1",
                    "table": `Table ${i + 1}`,
                    "restaurantId": 1
                });
            }
            let message = 'You cannot assign more than 4 tables to a waiter in a single restaurant';
            Command.assign(assignments).then(result => {
                done(new Error(message));
            }).catch(error => {
                expect(error).to.equal(message);
                done();
            });
        });

        it('should be able to assign a waiter to tables across restaurants', (done) => {
            let assignments = [];
            for (i = 0; i < 5; i++) {
                assignments.push({
                    "username": "waiter1",
                    "table": `Table ${i + 1}`,
                    "restaurantId": 1
                });
            } 
            assignments[4].restaurantId = 2;

            Command.assign(assignments)
                .then(result => {
                    Query.getAssignments().then(results => {
                        expect(results).to.have.lengthOf(5);
                        done();
                    });
                });
        });

    });

    describe('Report', () => {

        before((done) => {
            let assignments = [];
            
            for (i = 0; i < 3; i++) {
                assignments.push({
                    "username": `waiter1`,
                    "table": `Table ${i + 1}`,
                    "restaurantId": 1
                });
            } 

            let content = JSON.stringify(assignments, null, 2);

            fs.writeFile(dataFile, content, 'utf8', (error) => {
                if (error) return done(error);
                done();
            });
        });

        it('should be able to view tables that are unique to one restaurant with their corresponding waiters', (done) => {
            Query.getAssignmentDetails().then(report => {
                expect(report).to.have.lengthOf(2); // two restaurants
                expect(report[0].tables).to.have.lengthOf(20);
                expect(report[0].tables[0].waiterId).to.equal("waiter1");
                expect(report[0].tables.filter(tbl => tbl.waiter === "Unassigned")).to.have.lengthOf(17);
                expect(report[1].tables.filter(tbl => tbl.waiter === "Unassigned")).to.have.lengthOf(20);
                done();
            }).catch(error => done(error));
        })
    });
    
    describe('Waiter', () => {

        before((done) => {
            let assignments = [];
            for (i = 0; i < 3; i++) {
                assignments.push({
                    "username": "waiter1",
                    "table": `Table ${i + 1}`,
                    "restaurantId": 1
                });
            } 
            
            let content = JSON.stringify(assignments, null, 2);

            fs.writeFile(dataFile, content, 'utf8', (error) => {
                if (error) return done(error);
                done();
            });
        });

        it('should be able to see their table allotments across multiple restaurants', (done) => {
            Query.getAssignmentForWaiter("waiter1")
                .then(result => {
                    expect(result.assigned).to.have.lengthOf(1);
                    expect(result.waiter).to.equal("waiter1");
                    expect(result.assigned[0].restaurant).to.equal("Kim Sing Restaurant");
                    expect(result.assigned[0].tables).to.have.deep.equal(["Table 1", "Table 2", "Table 3"]);
                    done();
                }).catch(error => done(error));
        });

    });

});