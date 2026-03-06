const alasql = require('alasql');

// Tabelle in memoria per tutti gli scenari SQLi
alasql('CREATE TABLE users (id INT, username STRING, password STRING, role STRING)');
alasql('CREATE TABLE products (id INT, name STRING, price INT)');

alasql("INSERT INTO users VALUES (1, 'admin', 'admin123', 'admin')");
alasql("INSERT INTO users VALUES (2, 'mario', 'password', 'user')");
alasql("INSERT INTO users VALUES (3, 'luca', 'qwerty', 'user')");

alasql("INSERT INTO products VALUES (1, 'Notebook', 999)");
alasql("INSERT INTO products VALUES (2, 'Mouse', 25)");
alasql("INSERT INTO products VALUES (3, 'Tastiera', 79)");

module.exports = alasql;
