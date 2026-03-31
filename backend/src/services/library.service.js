const pool = require('../config/db')

const getLibrary = async (userId, type = null, status = null) => {
    let query = `
        SELECT le.*, c.title, c.type, c.poster_url, c.genres, c.rating as global_rating
        FROM library_entries le
        JOIN content c ON le.content_id = c.id
        WHERE le.user_id = $1
    `
    const params = [userId]

    if (type) {
        params.push(type)
        query += ` AND c.type = $${params.length}`
    }
    if (status) {
        params.push(status)
        query += ` AND le.status = $${params.length}`
    }

    query += ' ORDER BY le.updated_at DESC'
    const { rows } = await pool.query(query, params)
    return rows
}

const addToLibrary = async (userId, contentId, status, score = null, review = null) => {
    const { rows } = await pool.query(
        `INSERT INTO library_entries (user_id, content_id, status, score, review)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (user_id, content_id)
         DO UPDATE SET status = $3, score = $4, review = $5, updated_at = NOW()
         RETURNING *`,
        [userId, contentId, status, score, review]
    )
    return rows[0]
}

const updateEntry = async (userId, contentId, updates) => {
    const fields = []
    const params = [userId, contentId]

    if (updates.status !== undefined) {
        params.push(updates.status)
        fields.push(`status = $${params.length}`)
    }
    if (updates.score !== undefined) {
        params.push(updates.score)
        fields.push(`score = $${params.length}`)
    }
    if (updates.review !== undefined) {
        params.push(updates.review)
        fields.push(`review = $${params.length}`)
    }
    if (updates.started_at !== undefined) {
        params.push(updates.started_at)
        fields.push(`started_at = $${params.length}`)
    }
    if (updates.finished_at !== undefined) {
        params.push(updates.finished_at)
        fields.push(`finished_at = $${params.length}`)
    }

    fields.push('updated_at = NOW()')

    const { rows } = await pool.query(
        `UPDATE library_entries SET ${fields.join(', ')}
         WHERE user_id = $1 AND content_id = $2 RETURNING *`,
        params
    )
    if (rows.length === 0) {
        throw Object.assign(new Error('Entrada no encontrada'), { status: 404 })
    }
    return rows[0]
}

const removeFromLibrary = async (userId, contentId) => {
    await pool.query(
        'DELETE FROM library_entries WHERE user_id = $1 AND content_id = $2',
        [userId, contentId]
    )
}

const getStats = async (userId) => {
    const { rows } = await pool.query(
        `SELECT
            c.type,
            le.status,
            COUNT(*) as count,
            AVG(le.score) as avg_score
         FROM library_entries le
         JOIN content c ON le.content_id = c.id
         WHERE le.user_id = $1
         GROUP BY c.type, le.status`,
        [userId]
    )
    return rows
}

module.exports = { getLibrary, addToLibrary, updateEntry, removeFromLibrary, getStats }