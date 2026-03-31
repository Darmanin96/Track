const pool = require('./db');

const createTables = async () => { 
    const client = await pool.connect();
    try {
        await client.query(`BEGIN;`)
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
             id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        avatar_url VARCHAR(500),
        bio TEXT,
        is_public BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
            );
        `);
        await client.query(`CREATE TABLE IF NOT EXISTS content (
        id VARCHAR(100) PRIMARY KEY,
        type VARCHAR(20) NOT NULL CHECK (type IN ('movie', 'series', 'game')),
        title VARCHAR(500) NOT NULL,
        overview TEXT,
        poster_url VARCHAR(500),
        backdrop_url VARCHAR(500),
        release_date DATE,
        genres TEXT[],
        rating DECIMAL(3,1),
        external_id VARCHAR(100) NOT NULL,
        raw_data JSONB,
        cached_at TIMESTAMP DEFAULT NOW()
      )
    `);


        await client.query(`
             CREATE TABLE IF NOT EXISTS library_entries (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        content_id VARCHAR(100) REFERENCES content(id) ON DELETE CASCADE,
        status VARCHAR(20) NOT NULL CHECK (status IN ('watching', 'completed', 'pending', 'abandoned', 'playing', 'played')),
        score DECIMAL(3,1) CHECK (score >= 0 AND score <= 10),
        review TEXT,
        started_at DATE,
        finished_at DATE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, content_id)
      )
            `);


      await client.query(` COMMIT;`);
       console.log('Tables created successfully');

}catch (err) {
        await client.query(`ROLLBACK;`);
        console.error('Error creating tables:', err);
    } finally {
        client.release();
    }
  };

    module.exports = createTables

