import snowflake from 'snowflake-sdk';
import dotenv from 'dotenv';

dotenv.config();

const connectionConfig = {
  account: process.env.SNOWFLAKE_ACCOUNT,
  username: process.env.SNOWFLAKE_USERNAME,
  database: process.env.SNOWFLAKE_DATABASE,
  schema: process.env.SNOWFLAKE_SCHEMA,
  warehouse: process.env.SNOWFLAKE_WAREHOUSE,
  authenticator: 'SNOWFLAKE_JWT',
  token: process.env.SNOWFLAKE_PAT_TOKEN,
};

// Check if Snowflake is configured
const isSnowflakeConfigured = connectionConfig.account && 
  connectionConfig.account !== 'your_account_identifier' &&
  connectionConfig.username !== 'your_username';

let connection = null;
let useMockMode = !isSnowflakeConfigured;

// In-memory storage for mock mode
const mockStorage = {
  users: [],
  documents: []
};

export async function getConnection() {
  if (useMockMode) {
    console.log('Running in mock mode (no Snowflake connection)');
    return null;
  }

  if (connection) {
    return connection;
  }

  return new Promise((resolve, reject) => {
    connection = snowflake.createConnection(connectionConfig);
    
    connection.connect((err, conn) => {
      if (err) {
        console.error('Unable to connect to Snowflake:', err.message);
        console.log('Falling back to mock mode');
        useMockMode = true;
        resolve(null);
      } else {
        console.log('Successfully connected to Snowflake');
        resolve(conn);
      }
    });
  });
}

export async function executeQuery(sqlText, binds = []) {
  if (useMockMode) {
    return executeMockQuery(sqlText, binds);
  }

  const conn = await getConnection();
  
  if (!conn) {
    return executeMockQuery(sqlText, binds);
  }
  
  return new Promise((resolve, reject) => {
    conn.execute({
      sqlText,
      binds,
      complete: (err, stmt, rows) => {
        if (err) {
          console.error('Query execution error:', err.message);
          reject(err);
        } else {
          resolve(rows);
        }
      }
    });
  });
}

function executeMockQuery(sqlText, binds) {
  const sql = sqlText.toLowerCase().trim();
  
  // Handle CREATE TABLE (just return success)
  if (sql.startsWith('create table')) {
    return [];
  }
  
  // Handle INSERT INTO users
  if (sql.includes('insert into users')) {
    const user = {
      ID: binds[0],
      EMAIL: binds[1],
      PASSWORD_HASH: binds[2],
      NAME: binds[3],
      CREATED_AT: new Date().toISOString()
    };
    mockStorage.users.push(user);
    return [];
  }
  
  // Handle SELECT from users by email
  if (sql.includes('select') && sql.includes('from users') && sql.includes('email')) {
    const email = binds[0];
    const users = mockStorage.users.filter(u => u.EMAIL === email);
    return users;
  }
  
  // Handle SELECT from users by id
  if (sql.includes('select') && sql.includes('from users') && sql.includes('id = ?')) {
    const id = binds[0];
    const users = mockStorage.users.filter(u => u.ID === id);
    return users;
  }
  
  // Handle INSERT INTO documents
  if (sql.includes('insert into documents')) {
    const doc = {
      ID: binds[0],
      USER_ID: binds[1],
      FILENAME: binds[2],
      FILE_TYPE: binds[3],
      FILE_SIZE: binds[4],
      DOCUMENT_TYPE: binds[5],
      STATUS: 'pending',
      UPLOADED_AT: new Date().toISOString()
    };
    mockStorage.documents.push(doc);
    return [];
  }
  
  // Handle SELECT from documents
  if (sql.includes('select') && sql.includes('from documents') && sql.includes('user_id')) {
    const userId = binds[0];
    const docs = mockStorage.documents.filter(d => d.USER_ID === userId);
    return docs;
  }
  
  // Handle DELETE from documents
  if (sql.includes('delete from documents')) {
    const id = binds[0];
    const idx = mockStorage.documents.findIndex(d => d.ID === id);
    if (idx > -1) {
      mockStorage.documents.splice(idx, 1);
    }
    return [];
  }
  
  // Handle UPDATE users (password reset)
  if (sql.includes('update users') && sql.includes('password_hash')) {
    const passwordHash = binds[0];
    const userId = binds[1];
    const user = mockStorage.users.find(u => u.ID === userId);
    if (user) {
      user.PASSWORD_HASH = passwordHash;
    }
    return [];
  }
  
  // Handle SELECT document by id and user_id
  if (sql.includes('select') && sql.includes('from documents') && sql.includes('id = ?')) {
    const id = binds[0];
    const userId = binds[1];
    const docs = mockStorage.documents.filter(d => d.ID === id && d.USER_ID === userId);
    return docs;
  }
  
  return [];
}

export async function initializeDatabase() {
  try {
    // Create users table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),
        updated_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP()
      )
    `);

    // Create documents table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS documents (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        filename VARCHAR(255) NOT NULL,
        file_type VARCHAR(50),
        file_size INTEGER,
        document_type VARCHAR(100),
        status VARCHAR(50) DEFAULT 'pending',
        uploaded_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),
        processed_at TIMESTAMP_NTZ,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Create user_verification_data table for storing processed document data
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS user_verification_data (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        document_id VARCHAR(36) NOT NULL,
        data_type VARCHAR(100),
        data_value VARIANT,
        verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (document_id) REFERENCES documents(id)
      )
    `);

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error.message);
    throw error;
  }
}
