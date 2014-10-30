/**
 * Created by barrett on 8/28/14.
 */

var mysql = require('mysql');
var dbconfig = require('../config/database');

var connection = mysql.createConnection(dbconfig.connection);

connection.query('CREATE DATABASE ' + dbconfig.database);

connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.users_table + '` ( \
  `id` int(11) NOT NULL AUTO_INCREMENT,\
  `username` varchar(255) DEFAULT NULL,\
  `password` varchar(255) DEFAULT NULL,\
  `email` varchar(255) DEFAULT NULL,\
  `created_at` datetime DEFAULT NULL,\
  `last_login` datetime DEFAULT NULL,\
  PRIMARY KEY (`id`),\
  UNIQUE KEY `username` (`username`),\
  UNIQUE KEY `email` (`email`)\
)');

console.log('Success: Database Created!')

connection.end();
