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
                    expect(result.assigned).to.have.lengthOf(3);
                    expect(result.waiter).to.equal("waiter1");
                    expect(result.assigned[0].restaurant).to.equal("Kim Sing Restaurant");
                    done();
                }).catch(error => done(error));
        });

    });

});