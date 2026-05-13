/**
 * ==========================================================================
 * RUSUMO HIGH SCHOOL - DATABASE SCHEMA GENERATION & SEEDING (SQLITE3)
 * ==========================================================================
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Establish physical database file target mapping
const DB_PATH = path.join(__dirname, 'rusumo_school.db');
const db = new sqlite3.Database(DB_PATH);

db.serialize(() => {
    console.log("🛠️ Initializing SQLite Storage Engine...");

    // 1. Drop existing table to ensure a clean slate during development
    db.run(`DROP TABLE IF EXISTS students`);

    // 2. Generate clean relational schema structure using raw SQL
    db.run(`
        CREATE TABLE students (
            id TEXT PRIMARY KEY,
            pin TEXT NOT NULL,
            name TEXT NOT NULL,
            class_name TEXT NOT NULL,
            performance_division TEXT NOT NULL,
            aggregate_score INTEGER NOT NULL,
            conduct TEXT NOT NULL,
            outstanding_balance INTEGER NOT NULL
        )
    `);
    console.log("✅ Student relation layout table mapped successfully.");

    // 3. Prepare an optimized SQL insertion statement
    const statement = db.prepare(`
        INSERT INTO students (id, pin, name, class_name, performance_division, aggregate_score, conduct, outstanding_balance)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // 4. Inject authentic seed records for testing
    statement.run("RHS-2026-0001", "1234", "Jean Paul Uwiringiyimana", "Senior 5 PCM", "Division I", 82, "Excellent", 0);
    statement.run("RHS-2026-0002", "5678", "Marie Claire Mutoni", "Senior 6 MCB", "Division I", 91, "Outstanding", 15000);
    statement.run("RHS-2026-0003", "4321", "Emmanuel Nsengimana", "Senior 4 MEG", "Division II", 74, "Very Good", 0);

    statement.finalize();
    console.log("🎉 SQLite database successfully seeded with active student registries.");
});

db.close();
