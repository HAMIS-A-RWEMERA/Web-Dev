/**
 * ==========================================================================
 * RUSUMO HIGH SCHOOL - SERVER ENGINE CONNECTED TO SQLITE3 CORNERSTONE
 * ==========================================================================
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const PORT = 3005;
const DB_PATH = path.join(__dirname, 'rusumo_school.db');

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.ico': 'image/x-icon',
    '.mp3': 'audio/mpeg'
};

const server = http.createServer((req, res) => {
    console.log(`📡 [${req.method}] Request Route: ${req.url}`);

    /* ==========================================================================
       1. INTERCEPT PORTAL TRANSCRIPT REQUEST & QUERY SQLITE3
       ========================================================================== */
    if (req.method === 'POST' && req.url === '/api/reports.php') {
        let body = '';

        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            const params = new URLSearchParams(body);
            const studentId = params.get('student_id');
            const accessPin = params.get('access_pin');

            const db = new sqlite3.Database(DB_PATH);
            const sqlQuery = `SELECT * FROM students WHERE id = ? AND pin = ?`;
            
            db.get(sqlQuery, [studentId, accessPin], (err, row) => {
                if (err) {
                    console.error(`❌ DB Error: ${err.message}`);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: "Internal server error reading database." }));
                    db.close();
                    return;
                }

                if (row) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: true,
                        message: "Record matched and safely pulled.",
                        payload: {
                            student_name: row.name,
                            class: row.class_name,
                            term_performance: `${row.performance_division} (Aggregate ${row.aggregate_score}/100)`,
                            conduct: row.conduct,
                            financials: row.outstanding_balance === 0 ? "Cleared (0 RWF)" : `${row.outstanding_balance} RWF Outstanding Balance`
                        }
                    }));
                } else {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: false,
                        message: "Authentication failed. Incorrect student ID or security PIN."
                    }));
                }
            });

            db.close();
        });
        return;
    }

    /* ==========================================================================
       1B. INTERCEPT ADMIN ENROLLMENT REQUEST & EXECUTE RAW SQL INSERT (FIXED OUTSIDE NESTING)
       ========================================================================== */
    if (req.method === 'POST' && req.url === '/api/admin-enroll.php') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            const params = new URLSearchParams(body);
            
            const id = params.get('id');
            const pin = params.get('pin');
            const name = params.get('name');
            const class_name = params.get('class_name');
            const division = params.get('division');
            const score = parseInt(params.get('score'), 10);
            const conduct = params.get('conduct');
            const balance = parseInt(params.get('balance'), 10);

            const db = new sqlite3.Database(DB_PATH);
            const sqlInsert = `
                INSERT INTO students (id, pin, name, class_name, performance_division, aggregate_score, conduct, outstanding_balance)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;

            db.run(sqlInsert, [id, pin, name, class_name, division, score, conduct, balance], (err) => {
                if (err) {
                    console.error(`❌ SQL Insert Failure: ${err.message}`);
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ 
                        success: false, 
                        message: `Database error: ID duplicate found or invalid constraints.` 
                    }));
                } else {
                    console.log(`💾 SQL Transaction Success: ${name} added under ${id}`);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ 
                        success: true, 
                        message: `🎉 Success! Row successfully appended to SQLite storage layer.` 
                    }));
                }
            });
            db.close();
        });
        return;
    }
    /* ==========================================================================
       1C. INTERCEPT ADMIN PURGE REQUEST & EXECUTE RAW SQL DELETE
       ========================================================================== */
    if (req.method === 'POST' && req.url === '/api/admin-purge.php') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            const params = new URLSearchParams(body);
            const id = params.get('id');

            res.writeHead(200, { 'Content-Type': 'application/json' });
            const db = new sqlite3.Database(DB_PATH);

            // Parameterized Delete execution to ensure database isolation
            const sqlDelete = `DELETE FROM students WHERE id = ?`;

            db.run(sqlDelete, [id], function(err) {
                if (err) {
                    console.error(`❌ SQL Deletion Error: ${err.message}`);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: "Internal server hardware error during purge." }));
                    db.close();
                    return;
                }

                // checking 'this.changes' prints exactly how many rows were dropped from your table file
                if (this.changes > 0) {
                    console.log(`🗑️ SQL Purge Complete: Destroyed record entry node ${id}`);
                    res.end(JSON.stringify({ 
                        success: true, 
                        message: `🎉 Profile ${id} completely removed from the SQLite storage layer.` 
                    }));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ 
                        success: false, 
                        message: `❌ Purge Fault: Target ID "${id}" does not exist in our active registries.` 
                    }));
                }
            });
            db.close();
        });
        return;
    }

    /* ==========================================================================
       2. STATIC STATIC ROUTER PIPELINE (SAFE PATH ALIGNMENT)
       ========================================================================== */
    if (req.method === 'GET') {
        let urlPath = req.url === '/' ? '/index.html' : req.url;
        let filePath = path.join(__dirname, urlPath);
        
        const extname = String(path.extname(filePath)).toLowerCase();
        const contentType = MIME_TYPES[extname] || 'application/octet-stream';

        fs.readFile(filePath, (error, content) => {
            if (error) {
                if (error.code === 'ENOENT') {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end('<h1>404: Resource Node Not Found</h1>', 'utf-8');
                } else {
                    res.writeHead(500);
                    res.end(`System Error: ${error.code}`);
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
    }
});

// Go to the very bottom of server.js and replace the server.listen line with this:
// We drop '127.0.0.1' so the container accepts external public traffic routes
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Production Server Operational on Web Port Room: ${PORT}`);
});
