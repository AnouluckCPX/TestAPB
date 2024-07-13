const { connection } = require('../db/connection');

exports.getAllProduct = (req, res) => {
    connection.query('SELECT * FROM product', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        } else {
            res.status(200).json({ data: results });
        }
    });
};


exports.createProduct = (req, res) => {
    const { product_id, product_name, product_unit_price } = req.body;

    if (!product_id || !product_name || !product_unit_price) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const insertQuery = 'INSERT INTO product (product_id, product_name, product_unit_price) VALUES (?, ?, ?)';
    connection.query(insertQuery, [product_id, product_name, product_unit_price], (err, results) => {
        if (err) {
            console.error('Error executing query:', err.stack);
            return res.status(500).json({ message: 'Server error' });
        }

        const selectQuery = 'SELECT * FROM product WHERE product_id = ?';
        connection.query(selectQuery, [product_id], (err, productResults) => {
            if (err) {
                console.error('Error fetching product:', err.stack);
                return res.status(500).json({ message: 'Server error' });
            }

            return res.status(201).json({ message: 'Product inserted successfully', data: productResults[0] });
        });
    });
};