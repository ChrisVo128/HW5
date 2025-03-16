// Christopher Vo

var express = require('express');
var router = express.Router();
const dbms = require('./dbms.js');

router.post('/', function(req, res) {
    const { quantity, topping, notes, month } = req.body;
    
    // first get the topping ID based on the topping name
    const toppingQuery = `SELECT T_ID FROM toppings WHERE topping_name = '${topping}'`;
    
    dbms.dbquery(toppingQuery, (err, result) => {
        if (err || result.length === 0) {
            res.status(400).json({ error: 'Invalid topping' });
            return;
        }

        const T_ID = result[0].T_ID;
        const currentYear = new Date().getFullYear();

        // sanitize notes to prevent SQL injection
        const sanitizedNotes = notes.replace(/'/g, "''");
        
        const insertQuery = `
            INSERT INTO orders (T_ID, QUANTITY, NOTES, MONTH, YEAR) 
            VALUES (${T_ID}, ${quantity}, '${sanitizedNotes}', ${month}, ${currentYear})
        `;

        dbms.dbquery(insertQuery, (err, result) => {
            if (err) {
                res.status(500).json({ error: 'Failed to save order' });
                return;
            }
            res.json({ message: 'Order saved successfully' });
        });
    });
});

module.exports = router;