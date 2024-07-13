const { connection } = require('../db/connection');

exports.getAllSale = (req, res) => {
    connection.query('SELECT * FROM sale', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        } else {
            res.status(200).json({ data: results });
        }
    });
};


exports.createSale = (req, res) => {
    const sales = [
        { sale_id: "SS0006", user_id: "001", sale_datetime: '2020-04-17T19:08:28.000Z' },
    ];

    // Helper function to insert sale details
    const insertSaleDetails = (sale_id, saleDetails) => {
        return new Promise((resolve, reject) => {
            const queries = saleDetails.map(detail => {
                const { product_id, product_quantity, product_unit_price, product_price_amount } = detail;
                const detailQuery = 'INSERT INTO sale_detail (sale_id, product_id, product_quantity, product_price_amount) VALUES (?, ?, ?, ?)';
                return new Promise((resolve, reject) => {
                    connection.query(detailQuery, [sale_id, product_id, product_quantity, product_price_amount], (err, results) => {
                        if (err) {
                            console.error('Error inserting into sale_detail table:', err.stack);
                            reject(err);
                        } else {
                            resolve(results);
                        }
                    });
                });
            });

            // Execute all detail insertion queries
            Promise.all(queries)
                .then(results => {
                    resolve(results);
                })
                .catch(err => {
                    reject(err);
                });
        });
    };

    // Insert sales and details
    Promise.all(sales.map(sale => {
        const { sale_id, user_id, sale_datetime } = sale;
        const saleQuery = 'INSERT INTO sale (sale_id, user_id, sale_datetime) VALUES (?, ?, ?)';

        return new Promise((resolve, reject) => {
            connection.query(saleQuery, [sale_id, user_id, sale_datetime], (err, results) => {
                if (err) {
                    console.error('Error inserting into sale table:', err.stack);
                    reject(err);
                } else {
                    const insertedSaleId = results.insertId;
                    const saleDetails = [
                        { product_id: "P01", product_quantity: 2, product_unit_price: 100.5, product_price_amount: 2 * 100.5 },
                        { product_id: "P02", product_quantity: 2, product_unit_price: 50.5, product_price_amount: 2 * 50.5 }
                    ];

                    // Insert sale details
                    insertSaleDetails(insertedSaleId, saleDetails)
                        .then(() => {
                            resolve(results);
                        })
                        .catch(err => {
                            reject(err);
                        });
                }
            });
        });
    }))
        .then(() => {
            return res.status(200).json({ message: 'Sample data inserted successfully' });
        })
        .catch(err => {
            console.error('Error inserting sample data:', err);
            return res.status(500).json({ message: 'Failed to insert sample data' });
        });
};