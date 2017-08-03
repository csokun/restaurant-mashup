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

    app.post('/api/assignments', (req, res, next) => {
        let assignments = req.body;
        // validation ...
        
        // read (Query)    
        Query.getAssignments()
            .then(data => {
                // write (Command)
                Command.assign(assignments)
                    .then(result => res.json(result))
                    .catch(next);    
            }).catch(next);
    });

    app.get('/api/users', (req, res, next) => {
        Query.getWaiters().then(waiters => res.json(waiters)).catch(next);
    });
}