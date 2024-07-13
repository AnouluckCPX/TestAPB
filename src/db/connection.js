const db = require('mysql');
require("dotenv").config();

const dbConfig = {
    host: process.env.DB_SERVER,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    options: {
        enableArithAbort: true,
        encrypt: false
    },
};

const connection = db.createConnection(dbConfig);

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    } else {
        console.log('Connected to the database with thread ID:', connection.threadId);
    }
});

const query = (sql) => {
    return new Promise((resolve, reject) => {
        db.query(sql).then(res => {
            resolve(true)
        }).catch(e => {
            resolve()
        })
    })
}

const select = (sql) => {
    return new Promise((resolve, reject) => {
        db.query(sql).then(res => {
            resolve(res.recordsets[0])
        }).catch(e => {
            reject()
        })
    })
}

module.exports = {
    select,
    query,
    connection,
    dbConfig
};