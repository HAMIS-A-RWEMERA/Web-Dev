const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();

// 1. Initialize the SQLite Database
const db = new sqlite3.Database('./kgl_mart.db', (err) => {
    if (err) console.error('Database connection error:', err.message);
    else console.log('Connected to KGL Mart SQL database.');
});

// 2. Create the "Orders" table
db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    items TEXT,
    total REAL,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// 3. Middlewares
app.use(express.json()); // To read JSON data sent from your JS
app.use(express.static('public')); // To show your beautiful HTML/CSS

// 4. The "Order Receiver" Route
app.post('/api/place-order', (req, res) => {
    const { cartItems, totalAmount } = req.body;
    const sql = `INSERT INTO orders (items, total) VALUES (?, ?)`;
    
    db.run(sql, [JSON.stringify(cartItems), totalAmount], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ 
            message: "Order placed successfully!", 
            orderId: this.lastID 
        });
    });
});

// A secret route to see your orders in the browser
app.get('/view-orders-kgl-admin', (req, res) => {
    db.all("SELECT * FROM orders ORDER BY order_date DESC", [], (err, rows) => {
        if (err) return res.status(500).send(err.message);
        
        // Simple HTML table to display orders
        let html = '<h1>KGL Mart - Received Orders</h1><table border="1"><tr><th>ID</th><th>Items</th><th>Total (RWF)</th><th>Date</th></tr>';
        rows.forEach(row => {
            html += `<tr><td>${row.id}</td><td>${row.items}</td><td>${row.total}</td><td>${row.order_date}</td></tr>`;
        });
        html += '</table>';
        res.send(html);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
