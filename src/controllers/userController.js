const { connection } = require('../db/connection');

exports.getAllUsers = (req, res) => {
    connection.query('SELECT * FROM user', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        } else {
            res.status(200).json({ data: results });
        }
    });
};

exports.createUser = (req, res) => {
    const { user_id, user_name, user_password } = req.body;

    if (!user_id || !user_name || !user_password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const query = 'INSERT INTO user (user_id, user_name, user_password) VALUES (?, ?, ?)';
    connection.query(query, [user_id, user_name, user_password], (err, results) => {
        if (err) {
            console.error('Error executing query:', err.stack);
            return res.status(500).json({ message: 'Server error' });
        }

        return res.status(201).json({ message: 'User inserted successfully', userId: results.insertId });
    });
};


exports.LoginUser = (req, res) => {
    const { user_name, user_password } = req.body;

    if (!user_name || !user_password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const query = 'SELECT * FROM user WHERE user_name = ? AND user_password = ?';
    connection.query(query, [user_name, user_password], (err, results) => {
        if (err) {
            console.error('Error executing query:', err.stack);
            return res.status(500).json({ message: 'Server error' });
        }

        if (results.length > 0) {
            return res.status(200).json({ message: 'Login successful' });
        } else {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
    });
};





