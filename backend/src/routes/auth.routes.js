const router = require('express').Router()
const { register, login, getProfile } = require('../services/auth.service')
const { authMiddleware } = require('../middlewares/auth.middleware')

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
    try {
        const { username, email, password } = req.body
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'username, email y password son requeridos' })
        }
        if (password.length < 6) {
            return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' })
        }
        const result = await register(username, email, password)
        res.status(201).json(result)
    } catch (err) { next(err) }
})

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ error: 'email y password son requeridos' })
        }
        const result = await login(email, password)
        res.json(result)
    } catch (err) { next(err) }
})

// GET /api/auth/me
router.get('/me', authMiddleware, async (req, res, next) => {
    try {
        const user = await getProfile(req.user.id)
        res.json(user)
    } catch (err) { next(err) }
})

module.exports = router