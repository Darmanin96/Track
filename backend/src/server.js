require('dotenv').config();
const app = require('./app');
const createTables = require('./config/migrate');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await createTables();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`TMDB: ${process.env.TMDB_BASE_URL}`);
            console.log(`RAWG: ${process.env.RAWG_BASE_URL}`);
        });
    } catch (err) {
        console.error('Error starting server:', err);
        process.exit(1);
    }
};

startServer();