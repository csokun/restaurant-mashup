const Query = require('./api/queries');

module.exports = (app) => {

    // index
    app.all('/', (req, res, next) => {
        if (req.session.user) {
            res.render('index', { title: 'Home', user: req.session.user });
        } else {
            res.redirect('/login');
        }
    });

    app.get('/login', (req, res, next) => {
        Query.getAllUsers().then(users => {
            res.render('login', { data: users });
        });
    });

    app.post('/login', (req, res, next) => {
        let username = req.body.username;

        Query.findUser(username).then(user => {
            req.session.user = user;
            res.redirect('/');
        });
    });

    app.get('/logout', (req, res, next) => {
        req.session.user = null;
        res.redirect('/login');
    });
}