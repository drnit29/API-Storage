import mysql from 'mysql2/promise';

// Configuração da conexão com o banco de dados MySQL
const dbConfig = {
  host: 'srv1783.hstgr.io',
  user: 'u313634068_admin',
  password: 'Clara4014@',
  database: 'u313634068_api_storage',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Criar pool de conexões
const pool = mysql.createPool(dbConfig);

// Função para inicializar o banco de dados
const initDb = async () => {
  try {
    const connection = await pool.getConnection();
    
    // Criar tabela de serviços API
    await connection.query(`
      CREATE TABLE IF NOT EXISTS api_services (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        base_url TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Criar tabela de chaves API
    await connection.query(`
      CREATE TABLE IF NOT EXISTS api_keys (
        id VARCHAR(36) PRIMARY KEY,
        service_id VARCHAR(36) NOT NULL,
        name VARCHAR(255) NOT NULL,
        key_value TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (service_id) REFERENCES api_services(id) ON DELETE CASCADE
      )
    `);

    // Criar tabela de modelos
    await connection.query(`
      CREATE TABLE IF NOT EXISTS api_models (
        id INT AUTO_INCREMENT PRIMARY KEY,
        service_id VARCHAR(36) NOT NULL,
        model_name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (service_id) REFERENCES api_services(id) ON DELETE CASCADE
      )
    `);

    connection.release();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Executar a inicialização do banco de dados
initDb().catch(console.error);

// Função para executar queries
const query = async (sql, params) => {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

export default {
  query,
  pool
};
