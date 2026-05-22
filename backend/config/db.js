const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 1433,
    dialect: 'mssql',
    dialectOptions: {
      options: {
        encrypt: process.env.DB_ENCRYPT === 'true',
        trustServerCertificate: process.env.DB_TRUST_CERT !== 'false',
      },
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('SQL Server connected');
    await sequelize.sync();
    console.log('Database tables synced');
  } catch (error) {
    console.error(`SQL Server connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
