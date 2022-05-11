var mysql = require('mysql');

exports.con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "g3t0rad3"
});

exports.connectDB = function (conn) {
    conn.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
    });
}

exports.initDB = function (conn) {
    conn.query("CREATE DATABASE IF NOT EXISTS grocery", function (err, result) {
        if (err) throw err;
        console.log("Database Created");
    });

    conn.query("USE grocery", function (err, result) {
        if (err) throw err;
        console.log("Database Selected");
    });

    // qry = `
    // DROP TABLE users;
    // `
    // conn.query(qry, function (err, result) {
    //     if (err) throw err;
    //     console.log("....");
    // });

    qry = `
    CREATE TABLE IF NOT EXISTS users (
        userid int NOT NULL AUTO_INCREMENT,
        name varchar(100) NOT NULL,
        username varchar(20) NOT NULL UNIQUE,
        email varchar(255) NOT NULL,
        password varchar(32) NOT NULL,
        type char(1) DEFAULT 'C',
        PRIMARY KEY (userid)
    );
    `
    conn.query(qry, function (err, result) {
        if (err) throw err;
        console.log("User Table Created");
    });

    qry = `
    INSERT IGNORE INTO users Values 
    (1, 'System Admin', 'admin', 'admin@localhost', md5('passw0rd'), 'A');
    `
    conn.query(qry, function (err, result) {
        if (err) throw err;
        console.log("Admin User Created");
    });
}

exports.queryDB = function name(conn, sql) {
    return new Promise((resolve, reject) => {
        conn.query(sql, function (err, result) {        
            if (err) {
                reject(err);
            } 
            else {
                //console.log(result);
                resolve(result);
            } 
        });
    });
}
