/**
 * ==========================================================================
 * RUSUMO HIGH SCHOOL - SERVER ENGINE CONNECTED TO SQLITE3 CORNERSTONE
 * ==========================================================================
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const PORT = 3000;
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
    console.log(`📡 [${req.method}] ${req.url}`);

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

            // Set content type header to JSON instantly
            res.writeHead(200, { 'Content-Type': 'application/json' });

            // Establish direct channel to physical storage engine file
            const db = new sqlite3.Database(DB_PATH);

            // Execute parameterized query to avoid SQL Injection vulnerabilities
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
                    // Match found! Stream data back safely in JSON format
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
                    // Fail state: credentials did not match any stored records
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: false,
                        message: "Authentication failed. Incorrect student ID or security PIN."
                    }));
                }
            });

            // Gracefully terminate the database connection pool connection
            db.close();
        });
        return;
    }

    /* ==========================================================================
       2. STATIC STATIC ROUTER PIPELINE
       ========================================================================== */
    if (req.method === 'GET') {
        let filePath = req.url === '/' ? './index.html' : `.${req.url}`;
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

server.listen(PORT, () => {
    console.log(`🚀 Core Server Active: Point Chrome to http://localhost:${PORT}`);
});
