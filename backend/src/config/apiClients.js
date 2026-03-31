const axios = require('axios')
require('dotenv').config()

const tmdbClient = axios.create({
    baseURL: process.env.TMDB_BASE_URL,
    timeout: 5000,
    params: {
        api_key: process.env.TMDB_API_KEY,
        language: 'es-ES',
    },
})

const rawgClient = axios.create({
    baseURL: process.env.RAWG_BASE_URL,
    params: {
        key: process.env.RAWG_API_KEY
    }
})

tmdbClient.interceptors.response.use(
    res => res,
    err => {
        const msg = err.response?.data?.status_message || err.message
        const error = new Error(`TMDB: ${msg}`)
        error.status = err.response?.status || 502
        return Promise.reject(error)
    }
)

rawgClient.interceptors.response.use(
    res => res,
    err => {
        const msg = err.response?.data?.detail || err.message
        const error = new Error(`RAWG: ${msg}`)
        error.status = err.response?.status || 502
        return Promise.reject(error)
    }
)

module.exports = { tmdbClient, rawgClient }