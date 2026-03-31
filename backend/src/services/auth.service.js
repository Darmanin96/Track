const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const pool = require('../config/db')

const register = async (username, email, password) => {
    const exist = await pool.query(
        'SELECT id FROM users WHERE email = $1 OR username = $2',
        [email, username]
    )
    if (exist.rows.length > 0) {
        throw Object.assign(new Error('El usuario o email ya existe'), { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await pool.query(
        'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email',
        [username, email, hashedPassword]
    )

    const newUser = user.rows[0]
    const token = jwt.sign(
        { id: newUser.id, username: newUser.username },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    )
    return { token, user: newUser }
}

const login = async (email, password) => {
    const user = await pool.query(
        'SELECT id, username, email, password_hash FROM users WHERE email = $1',
        [email]
    )
    if (user.rows.length === 0) {
        throw Object.assign(new Error('Credenciales inválidas'), { status: 401 })
    }

    const isMatch = await bcrypt.compare(password, user.rows[0].password_hash)
    if (!isMatch) {
        throw Object.assign(new Error('Credenciales inválidas'), { status: 401 })
    }

    const token = jwt.sign(
        { id: user.rows[0].id, username: user.rows[0].username },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    )
    return {
        token,
        user: {
            id: user.rows[0].id,
            username: user.rows[0].username,
            email: user.rows[0].email
        }
    }
}

const getProfile = async (userId) => {
    const user = await pool.query(
        'SELECT id, username, email, avatar_url, bio, is_public, created_at FROM users WHERE id = $1',
        [userId]
    )
    if (user.rows.length === 0) {
        throw Object.assign(new Error('Usuario no encontrado'), { status: 404 })
    }
    return user.rows[0]
}

module.exports = { register, login, getProfile }