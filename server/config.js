const mysql = require('mysql2');
const fs = require('fs');
const path = require('path'); 

// Define the database configuration
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'September@2003', 
  multipleStatements: true
});

// Connect to MySQL server and create the database if it doesn't exist
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');

  // Step 1: Create the database if it doesn’t exist
  db.query('CREATE DATABASE IF NOT EXISTS SciAs_dbase', (err) => {
    if (err) {
      console.error('Error creating database:', err);
      return;
    }
    console.log('Database SciAs_dbase created or exists already');

    // Step 2: Switch to the SciAs_dbase database
    db.changeUser({ database: 'SciAs_dbase' }, (err) => {
      if (err) {
        console.error('Error switching to SciAs_dbase:', err);
        return;
      }
      
      // Step 3: Define the path to schema.sql
      const schemaPath = path.join(__dirname, 'schema.sql');
      console.log('Schema path:', schemaPath); 
      
      // Step 4: Read and execute schema.sql file
      const sql = fs.readFileSync(schemaPath, 'utf8');
      db.query(sql, (err, result) => {
        if (err) {
          console.error('Error executing schema:', err);
          return;
        }
        console.log('Schema executed successfully');
      });
    });
  });
});

module.exports = db;
