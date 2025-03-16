// Christopher Vo

var express = require('express');
var router = express.Router();
const dbms = require('./dbms.js');  // import the database module

// handle POST request to get orders for a specific month
router.post('/', function(req, res) {
    const month = parseInt(req.body.month);
    console.log('Requested month:', month); // Add this for debugging

    // SQL query to get orders with topping details for the specified month
    const query = `
        SELECT o.QUANTITY, t.topping_name, t.price, o.NOTES
        FROM orders o
        JOIN toppings t ON o.T_ID = t.T_ID
        WHERE o.MONTH = ${month} AND o.YEAR = 2023
    `;

    dbms.dbquery(query, (err, result) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).json({ error: 'Database error' });
            return;
        }

        console.log('Query results:', result); // Add this for debugging

        // calculate total and format orders
        let total = 0;
        const orders = result.map(row => {
            const orderTotal = row.QUANTITY * row.price;
            total += orderTotal;
            return {
                quantity: row.QUANTITY,
                topping: row.topping_name,
                notes: row.NOTES
            };
        });

        res.json({
            orders: orders,
            total: total.toFixed(2)
        });
    });
});

module.exports = router;