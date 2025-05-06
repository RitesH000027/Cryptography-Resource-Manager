const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkDatabaseConnection() {
  console.log(`Checking database connection...`);
  
  // Get database config from environment variables
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'cryptography_resources'
  };
  
  console.log(`Database config:`, dbConfig);
  
  try {
    // First try to connect to MySQL server (without specifying a database)
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password
    });
    
    console.log(`✅ MySQL server is running and accessible`);
    
    // Check if database exists
    const [rows] = await connection.query(
      `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`, 
      [dbConfig.database]
    );
    
    // If database doesn't exist, create it
    if (rows.length === 0) {
      console.log(`Database '${dbConfig.database}' not found, creating it...`);
      await connection.query(`CREATE DATABASE ${dbConfig.database}`);
      console.log(`✅ Database '${dbConfig.database}' created successfully`);
    } else {
      console.log(`✅ Database '${dbConfig.database}' exists and is accessible`);
    }
    
    // Connect to the specific database
    await connection.query(`USE ${dbConfig.database}`);
    
    // Check if critical tables exist
    console.log(`Checking if critical tables exist...`);
    const criticalTables = [
      'users',
      'user_permissions',
      'verification_tokens',
      'audit_logs',
      'user_settings',
      'resources' // Add resources table to critical tables list
    ];
    
    // Get list of tables in the database
    const [tables] = await connection.query(
      `SELECT table_name FROM information_schema.tables 
       WHERE table_schema = ?`, 
      [dbConfig.database]
    );
    
    const tableNames = tables.map(t => t.TABLE_NAME || t.table_name);
    console.log('Tables found:', tableNames);
    
    // Check each critical table
    const missingTables = criticalTables.filter(
      table => !tableNames.some(t => t.toLowerCase() === table.toLowerCase())
    );
    
    if (missingTables.length > 0) {
      console.log(`⚠️ Missing critical tables: ${missingTables.join(', ')}`);
      
      // If resources table is missing, create it
      if (missingTables.includes('resources')) {
        console.log('Creating resources table...');
        await connection.query(`
          CREATE TABLE resources (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            type VARCHAR(50) NOT NULL,
            url VARCHAR(255),
            file_path VARCHAR(255),
            created_by INT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
          );
        `);
        console.log('✅ Resources table created successfully');
      }
      
    } else {
      console.log(`✅ All required tables exist`);
    }
    
    // Close connection
    await connection.end();
    console.log(`Database connection check complete.`);
    return true;
    
  } catch (error) {
    console.error(`❌ Database connection failed: ${error.message}`);
    console.log('\nPossible issues:');
    console.log('1. MySQL server is not running');
    console.log('2. Database credentials in .env file are incorrect');
    console.log('3. Network connectivity issues');
    console.log('4. Firewall blocking the connection');
    
    console.log('\nSuggested actions:');
    console.log('1. Check if MySQL service is running');
    console.log('2. Verify DB_HOST, DB_USER, DB_PASSWORD in your .env file');
    console.log('3. Make sure your user has necessary privileges');
    console.log('4. Check firewall settings for port 3306');
    
    return false;
  }
}

// Run directly if this script is executed directly (not required)
if (require.main === module) {
  checkDatabaseConnection()
    .then(success => {
      console.log(`Database connection check ${success ? 'successful ✅' : 'failed ❌'}`);
      if (!success) process.exit(1);
    })
    .catch(err => {
      console.error('Unexpected error during database check:', err);
      process.exit(1);
    });
}

module.exports = checkDatabaseConnection; 