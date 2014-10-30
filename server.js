// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var mysql   = require('mysql');
var port     = process.env.PORT || 8080;

var passport = require('passport');
var expressSession = require('express-session');
var flash    = require('connect-flash');
var hbs = require('express-handlebars');

//bookmarks DB

connectionpool = mysql.createPool({
        host     : 'localhost',
        user     : 'admin',
        password : '',
        database : 'taskplosion'
   });
   



// configuration ===============================================================
// connect to our database

require('./config/passport')(passport); // pass passport for configuration

// connect to bookmarks db

require('./config/bookmarks');

app.configure(function() {

	// set up our express application
	app.use(express.logger('dev')); // log every request to the console
	app.use(express.cookieParser()); // read cookies (needed for auth)
	app.use(express.bodyParser()); // get information from html forms
	app.use(express.static(__dirname + '/public'));

	//app.set('view engine', 'ejs'); // set up ejs for templating
	app.engine('handlebars', hbs({defaultLayout: 'main'}));
	app.set('view engine', 'handlebars');


	// required for passport
	app.use(express.session({ secret: 'mySecretKey' } )); // session secret
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions
	app.use(flash()); // use connect-flash for flash messages stored in session
	app.use(function(req, res, next) {
            req.cache   = require('memoizee');
            req.store   = app.locals;
            next();
        });

});

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

app.get('/data/bookmarks', function(req,res){
	 connectionpool.getConnection(function(err, connection) {
        if (err) {
            console.error('CONNECTION error: ',err);
            res.statusCode = 503;
              res.send({
                result: 'error',
                err:    err.code
            });
        } else {
             connection.query('SELECT * FROM bookmarks ORDER BY id DESC LIMIT 20', req.params.id, function(err, rows, fields) {
                if (err) {
                    console.error(err);
                    res.statusCode = 500;
                    res.send({
                        result: 'error',
                        err:    err.code
                    });
                }
                res.send(JSON.stringify(rows));
                connection.release();
            });
        }
    });
});
app.get('/data/bookmarks/:id', function(req,res){
		 connectionpool.getConnection(function(err, connection) {
        if (err) {
            console.error('CONNECTION error: ',err);
            res.statusCode = 503;
              res.send({
                result: 'error',
                err:    err.code
            });
        } else {
             connection.query('SELECT * FROM bookmarks WHERE id = '+req.params.id+'', req.params.id, function(err, rows, fields) {
                if (err) {
                    console.error(err);
                    res.statusCode = 500;
                    res.send({
                        result: 'error',
                        err:    err.code
                    });
                }
                //TODO check JSON stringify
                res.send(JSON.stringify(rows));
                connection.release();
            });
        }
    });
	
});
app.post('/data/bookmarks', function(req,res){
	connectionpool.getConnection(function(err, connection) {
	 	connection.query('INSERT INTO bookmarks SET ?', req.body, function (err, result) {
       		 if (err)return; 
       		 res.statusCode = 201;
       		 res.send({
           		 result: 'success',
           		 err:    '',
           		 id:     result.insertId
       		 });
        	connection.release();
   		 });
	
	});
});
app.put('/data/bookmarks/:id', function(req,res){
connection.query('UPDATE bookmarks SET ? WHERE id='+req.params.id, req.query, function (err) {
        if (err)return; 
        handleFind(req,res);
    });
});
app.get('/data/bookmarks/:id', function(req,res){
	
	    connection.query('DELETE FROM bookmarks WHERE id = ?', req.params.id, function handleSql(err) {
        if (err)return; 
        res.send({
            result: 'success',
            err:    '',
            id:     req.params.id
        });
        connection.release();
    });
	
});

function handleFind(req,res) {
    var find = function find(id){
        connection.query('SELECT * FROM bookmarks WHERE id = ?', id, function (err, rows) {
            if (err) return; 
            if (rows.length === 0){ res.send(204); return; }
            res.send({
                result: 'success',
                err:    '',
                id:     id,
                json:   rows[0],
                length: 1
            });
            connection.release();
        });
    };
    var cacheFind = req.cache(find, { async: true, maxAge: 1000*60, preFetch: true });
    cacheFind(req.params.id);
}

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
