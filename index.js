const express = require('express');
const path = require('path');
const app = require('./src/app');
const port = 3000;
const applyMiddleware = require('./src/middleware');
const { dbConfig, connection } = require('./src/db/connection');
var indexRouter = require('./src/routes/index');


// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Apply middleware
applyMiddleware(app);


app.use('/api', indexRouter);


app.get('/app', (req, res) => {
    const sql = 'SELECT * FROM user';
    connection.query(sql, (err, results) => {
        if (err) return res.json({ message: 'Server error' });
        return res.json({ data: results });
    });
    // res.status(200).json({ data: 'Hello' });
})


// Home route to render the welcome view
app.get('/', (req, res) => {
    res.render('welcome', { message: `Welcome to the database ${dbConfig.database}` });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});