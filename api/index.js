const Command = require('./commands');
const Query = require('./queries');

module.exports = (app) => {
    //CORS middleware
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        next();
    });

    app.get('/api/assignments', (req, res, next) => {
        Query.getAssignments()
            .then(data => res.json(data))
            .catch(next);
    });

    /**
     * POST /api/assignments
     * It should be protected & only managers allowed to make request;
     * but it is not implemented in this demo
     */
    app.post('/api/assignments', (req, res, next) => {
        let assignments = req.body;        
        // read (Query)    
        Query.getAssignments()
            .then(data => {
                // write (Command)
                Command.assign(assignments)
                    .then(result => res.json(result))
                    .catch(next);    
            }).catch(next);
    });

    /**
     * GET /api/waiters
     * Imagine - manager - to assign a waiter to tables
     * He/she needs to retrieve waiters list.
     */
    app.get('/api/waiters', (req, res, next) => {
        Query.getWaiters().then(waiters => res.json(waiters)).catch(next);
    });

    /**
     * GET /api/restaurants
     * - manager - this endpoint is for you as well
     */
    app.get('/api/restaurants', (req, res, next) => {
        Query.getRestaurants().then(restaurants => res.json).catch(next);
    });
    
};