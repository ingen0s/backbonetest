/**
 * Created by barrett on 8/28/14.
 */

var mysql = require('mysql');
var dbconfig = require('../config/tags_database');

var connection = mysql.createConnection(dbconfig.connection);

//connection.query('CREATE DATABASE ' + dbconfig.database);

connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.users_table + '` ( \
  `bookmark_id` int(11) DEFAULT NULL,\
  `tag` varchar(255) DEFAULT NULL,\
  KEY `bookmarkIdIdx` (`bookmark_id`),\
  KEY `tagIdx` (`tag`)\
)');

console.log('Success: Database Created!')

connection.end();
