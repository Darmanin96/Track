const router = require('express').Router()
const contentService = require('../services/content.service')

// GET /api/content/search?q=breaking+bad&type=all
router.get('/search', async (req, res, next) => {
    try {
        const { q, type = 'all', page = 1 } = req.query
        if (!q) {
            return res.status(400).json({ error: 'El parámetro q es requerido' })
        }

        let results
        if (type === 'movie') results = await contentService.searchMovies(q, page)
        else if (type === 'series') results = await contentService.searchSeries(q, page)
        else if (type === 'game') results = await contentService.searchGames(q, page)
        else results = await contentService.searchAll(q)

        res.json(results)
    } catch (err) { next(err) }
})

// GET /api/content/trending
router.get('/trending', async (req, res, next) => {
    try {
        const results = await contentService.getTrending()
        res.json(results)
    } catch (err) { next(err) }
})

// GET /api/content/movie/:id
router.get('/movie/:id', async (req, res, next) => {
    try {
        const result = await contentService.getMovieDetail(req.params.id)
        res.json(result)
    } catch (err) { next(err) }
})

// GET /api/content/series/:id
router.get('/series/:id', async (req, res, next) => {
    try {
        const result = await contentService.getSeriesDetail(req.params.id)
        res.json(result)
    } catch (err) { next(err) }
})

// GET /api/content/game/:id
router.get('/game/:id', async (req, res, next) => {
    try {
        const result = await contentService.getGameDetail(req.params.id)
        res.json(result)
    } catch (err) { next(err) }
})

module.exports = router