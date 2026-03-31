const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')

const authRoutes = require('./routes/auth.routes')
const contentRoutes = require('./routes/content.routes')
const libraryRoutes = require('./routes/library.routes')
const { errorHandler } = require('./middlewares/error.middleware')

const app = express()

app.use(helmet())
app.use(cors({ origin: process.env.FRONTEND_URL || '*', credentials: true }))
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }))
app.use(express.json())
app.use(morgan('dev'))

app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }))

app.use('/api/auth', authRoutes)
app.use('/api/content', contentRoutes)
app.use('/api/library', libraryRoutes)

app.use(errorHandler)

module.exports = app