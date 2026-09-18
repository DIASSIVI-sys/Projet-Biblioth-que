const {Pool ,types} = require('pg');
require('dotenv').config();

types.setTypeParser(1082, (val) =>val); // Pour les BIGINT

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    ssl: {
        rejectUnauthorized: false
    }
});


pool.on('connect', () => {
    console.log('Connecté a la base de données PostgreSQL  ');  
   });

pool.on('error', (err) => {
    console.error('Erreur de connexion à la base de données PostgreSQL :', err);
    process.exit(1); // Arrête le processus en cas d'erreur de connexion
});

module.exports = pool;