const express = require('express');
const path = require('path');
const sql = require('mssql');

const app = express();
const PORT = process.env.PORT || 3000;


const dbConfig = {
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

let dbPool;

if (dbConfig.server && dbConfig.user && dbConfig.password && dbConfig.database) {
    dbPool = new sql.ConnectionPool(dbConfig)
        .connect()
        .then(pool => {
            console.log('Connected to SQL Server');
            return pool;
        })
        .catch(err => console.error('Database Connection Failed! Bad Config: ', err));
} else {
    console.warn('Database environment variables (DB_SERVER, DB_DATABASE, DB_USER, DB_PASSWORD) are not fully set. Database-dependent endpoints will not work.');
}

// Middlewares
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.get('/api/messages', async (req, res) => {
    if (!dbPool) {
        return res.status(503).json({ ok: false, message: 'Database connection not available.' });
    }
    
    try {
        const pool = await dbPool;
        const result = await pool.request().query('SELECT Login_Emisor, Contenido FROM [dbo].[Chat_Mensaje] ORDER BY Cod_Mensaje ASC');
        res.json({
            ok: true,
            messages: result.recordset
        });
    } catch (error) {
        console.error('Error querying database:', error);
        res.status(500).json({ ok: false, message: 'Error fetching messages from database.' });
    }
});

// Fallback route for Single Page Applications
// This should be the last route. It sends index.html for any request that doesn't match a static file or API route.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});