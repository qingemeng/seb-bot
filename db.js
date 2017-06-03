"use strict";

let sqlite3 = require('sqlite3').verbose();
let fs = require('fs');

let initDB = function () {
    let dbFile = './database.db';
    let dbExists = fs.existsSync(dbFile);
    if (!dbExists) {
        fs.openSync(dbFile, 'w');
    }
    return new sqlite3.Database(dbFile);
};

module.exports = {
    init: initDB
}