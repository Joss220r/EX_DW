const express = require('express');
const path = require('path');
const sql = require('mssql');

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection configuration
// The connection string should be set in the DB_URL environment variable
// Example format: "mssql://usr_DesaWebDevUMG:!ngGuast@360@svr-sql-ctezo.southcentralus.cloudapp.azure.com/db_DesaWebDevUMG?encrypt=true"
const dbUrl = process.env.DB_URL;

let dbPool;
if (dbUrl) {
    dbPool = new sql.ConnectionPool(dbUrl)
        .connect()
        .then(pool => {
            console.log('Connected to SQL Server');
            return pool;
        })
        .catch(err => console.error('Database Connection Failed! Bad Config: ', err));
} else {
    console.warn('DB_URL environment variable not set. Database-dependent endpoints will not work.');
}


// Middlewares
app.use(express.json());
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

// Serve frontend for any other route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});