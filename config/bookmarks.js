// config/bookmarks.js



// load up the bookmarks model
var mysql = require('mysql');
var dbconfig = require('./bookmarks_database');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);
// expose this function to our app using module.exports

module.exports = function() {
	var key = '_edit_lock'; 
	var queryString = 'SELECT * FROM bookmarks';
	   
     connection.query(queryString, function(err,rows){
            
        if(err)
           console.log("Error Selecting : %s ",err );
		   
		   
			for (var i in rows) {
			console.log('User Name: ', rows[i].id);
			}
  
	});
};