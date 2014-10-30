/**
 * Created by barrett on 8/28/14.
 */

var mysql = require('mysql');
var dbconfig = require('../config/bookmarks_database');

var connection = mysql.createConnection(dbconfig.connection);

//connection.query('CREATE DATABASE ' + dbconfig.database);

connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.users_table + '` ( \
 `id` int(11) NOT NULL AUTO_INCREMENT,\
  `user_id` int(11) DEFAULT NULL,\
  `title` varchar(255) DEFAULT NULL,\
  `description` varchar(255) DEFAULT NULL,\
  `url` text,\
  `private` tinyint(4) DEFAULT NULL,\
  `created_at` datetime DEFAULT NULL,\
  PRIMARY KEY (`id`),\
  KEY `userIdIdx` (`user_id`)\
)');

console.log('Success: Database Created!')

connection.end();
