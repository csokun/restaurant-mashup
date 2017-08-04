const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override')
const helmet = require('helmet');
const session = require('express-session');

/**
 * APP CONFIG & BOOTSTRAP
 */
app.use(session({ 
    secret: 'zno2~PMl;q.VXuFS3So*wX$3$wks3{./[]LvM1_^IHB<-+Mz*(-(gW<(l+wY!o_:',
    resave: false,
    saveUninitialized: true
}));

app.use(helmet({
    frameguard: { action: 'deny' }
}));

app.disable('x-powered-by');
app.use(express.static('assets'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
    }
}));

app.set('view engine', 'pug');

// API(s)
require('./api')(app);

// Pages
require('./pages')(app);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    res.render('404');
});

// error handler
app.use(function (err, req, res, next) {
    if (res.headersSent)
        return next(err);

    res.status(err.status || 500);
    res.json({
        message: err.message,
        // production error handler
        // no stacktraces leaked to user
        error: (app.get('env') === 'development' || app.get('env') === 'dev') ? err : {}
    });
});

module.exports = app;
