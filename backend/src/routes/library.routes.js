const router = require('express').Router()
const libraryService = require('../services/library.service')
const { authMiddleware } = require('../middlewares/auth.middleware')

router.use(authMiddleware)

// GET /api/library?type=movie&status=completed
router.get('/', async (req, res, next) => {
    try {
        const { type, status } = req.query
        const entries = await libraryService.getLibrary(req.user.id, type, status)
        res.json(entries)
    } catch (err) { next(err) }
})

// GET /api/library/stats
router.get('/stats', async (req, res, next) => {
    try {
        const stats = await libraryService.getStats(req.user.id)
        res.json(stats)
    } catch (err) { next(err) }
})

// POST /api/library
router.post('/', async (req, res, next) => {
    try {
        const { contentId, status, score, review } = req.body
        if (!contentId || !status) {
            return res.status(400).json({ error: 'contentId y status son requeridos' })
        }
        const entry = await libraryService.addToLibrary(req.user.id, contentId, status, score, review)
        res.status(201).json(entry)
    } catch (err) { next(err) }
})

// PATCH /api/library/:contentId
router.patch('/:contentId', async (req, res, next) => {
    try {
        const entry = await libraryService.updateEntry(req.user.id, req.params.contentId, req.body)
        res.json(entry)
    } catch (err) { next(err) }
})

// DELETE /api/library/:contentId
router.delete('/:contentId', async (req, res, next) => {
    try {
        await libraryService.removeFromLibrary(req.user.id, req.params.contentId)
        res.json({ message: 'Eliminado de la biblioteca' })
    } catch (err) { next(err) }
})

module.exports = router