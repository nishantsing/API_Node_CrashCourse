import sqlite3 from "sqlite3";
const sql3 = sqlite3.verbose(); // more detailed error logging

// const DB = new sql3.Database(':memory:', sql3.OPEN_READWRITE, connected); // in memory
// const DB = new sql3.Database('', sql3.OPEN_READWRITE, connected); // creates a temp file
const DB = new sql3.Database("./mydata.db", sql3.OPEN_READWRITE, connected);

function connected(err) {
    if (err) {
        // throw new Error('Unable to connect')
        console.log(err.message);
    }
    console.log("Connected to DB or SQLite DB already exist");
}

//INTEGER, REAL TEXT, NULL, BLOB - datatypes
// IF NOT EXISTS - Create table only if it doesn't exists, first run it would create and subsequent runs this will handle
let sql = `CREATE TABLE IF NOT EXISTS enemies( 
    enemy_id INTEGER PRIMARY KEY,
    enemy_name TEXT NOT NULL,
    enemy_reason TEXT NOT NULL
)`;

DB.run(sql, [], (err) => {
    if (err) return console.log("error creating enemies table");
    console.log("CREATED TABLE");
});

// export default DB;
export { DB };
