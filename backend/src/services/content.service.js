const { tmdbClient, rawgClient } = require('../config/apiClients')
const pool = require('../config/db')

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500'
const TMDB_BACKDROP_BASE = 'https://image.tmdb.org/t/p/w1280'

const searchMovies = async (query, page = 1) => {
  const { data } = await tmdbClient.get('/search/movie', { params: { query, page } })
  return data.results.map(formatMovie)
}

const searchSeries = async (query, page = 1) => {
  const { data } = await tmdbClient.get('/search/tv', { params: { query, page } })
  return data.results.map(formatSeries)
}

const searchGames = async (query, page = 1) => {
  const { data } = await rawgClient.get('/games', { params: { search: query, page, page_size: 20 } })
  return data.results.map(formatGame)
}

const searchAll = async (query) => {
  const [movies, series, games] = await Promise.allSettled([
    searchMovies(query),
    searchSeries(query),
    searchGames(query)
  ])
  return {
    movies: movies.status === 'fulfilled' ? movies.value.slice(0, 5) : [],
    series: series.status === 'fulfilled' ? series.value.slice(0, 5) : [],
    games: games.status === 'fulfilled' ? games.value.slice(0, 5) : []
  }
}

const getMovieDetail = async (tmdbId) => {
  const cacheId = `movie_${tmdbId}`
  const cached = await pool.query('SELECT * FROM content WHERE id = $1', [cacheId])
  if (cached.rows.length > 0) return cached.rows[0]

  const { data } = await tmdbClient.get(`/movie/${tmdbId}`)
  const formatted = formatMovie(data)
  await cacheContent(cacheId, 'movie', formatted, data)
  return formatted
}

const getSeriesDetail = async (tmdbId) => {
  const cacheId = `series_${tmdbId}`
  const cached = await pool.query('SELECT * FROM content WHERE id = $1', [cacheId])
  if (cached.rows.length > 0) return cached.rows[0]

  const { data } = await tmdbClient.get(`/tv/${tmdbId}`)
  const formatted = formatSeries(data)
  await cacheContent(cacheId, 'series', formatted, data)
  return formatted
}

const getGameDetail = async (rawgId) => {
  const cacheId = `game_${rawgId}`
  const cached = await pool.query('SELECT * FROM content WHERE id = $1', [cacheId])
  if (cached.rows.length > 0) return cached.rows[0]

  const { data } = await rawgClient.get(`/games/${rawgId}`)
  const formatted = formatGame(data)
  await cacheContent(cacheId, 'game', formatted, data)
  return formatted
}

const getTrending = async () => {
  const [movies, series, games] = await Promise.allSettled([
    tmdbClient.get('/trending/movie/week').then(r => r.data.results.slice(0, 10).map(formatMovie)),
    tmdbClient.get('/trending/tv/week').then(r => r.data.results.slice(0, 10).map(formatSeries)),
    rawgClient.get('/games', { params: { ordering: '-rating', page_size: 10 } }).then(r => r.data.results.map(formatGame))
  ])
  return {
    movies: movies.status === 'fulfilled' ? movies.value : [],
    series: series.status === 'fulfilled' ? series.value : [],
    games: games.status === 'fulfilled' ? games.value : []
  }
}

const cacheContent = async (id, type, formatted, raw) => {
  await pool.query(
    `INSERT INTO content (id, type, title, overview, poster_url, backdrop_url, release_date, genres, rating, external_id, raw_data)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
     ON CONFLICT (id) DO UPDATE SET raw_data = $11, cached_at = NOW()`,
    [
      id, type,
      formatted.title,
      formatted.overview,
      formatted.poster_url,
      formatted.backdrop_url,
      formatted.release_date || null,
      formatted.genres,
      formatted.rating,
      formatted.external_id,
      JSON.stringify(raw)
    ]
  )
}

const formatMovie = (m) => ({
  id: `movie_${m.id}`,
  external_id: String(m.id),
  type: 'movie',
  title: m.title,
  overview: m.overview,
  poster_url: m.poster_path ? `${TMDB_IMAGE_BASE}${m.poster_path}` : null,
  backdrop_url: m.backdrop_path ? `${TMDB_BACKDROP_BASE}${m.backdrop_path}` : null,
  release_date: m.release_date,
  genres: m.genres?.map(g => g.name) || m.genre_ids || [],
  rating: m.vote_average ? parseFloat(m.vote_average.toFixed(1)) : null
})

const formatSeries = (s) => ({
  id: `series_${s.id}`,
  external_id: String(s.id),
  type: 'series',
  title: s.name,
  overview: s.overview,
  poster_url: s.poster_path ? `${TMDB_IMAGE_BASE}${s.poster_path}` : null,
  backdrop_url: s.backdrop_path ? `${TMDB_BACKDROP_BASE}${s.backdrop_path}` : null,
  release_date: s.first_air_date,
  genres: s.genres?.map(g => g.name) || s.genre_ids || [],
  rating: s.vote_average ? parseFloat(s.vote_average.toFixed(1)) : null
})

const formatGame = (g) => ({
  id: `game_${g.id}`,
  external_id: String(g.id),
  type: 'game',
  title: g.name,
  overview: g.description_raw || g.description || '',
  poster_url: g.background_image || null,
  backdrop_url: g.background_image || null,
  release_date: g.released,
  genres: g.genres?.map(g => g.name) || [],
  rating: g.rating ? parseFloat(g.rating.toFixed(1)) : null
})

module.exports = {
  searchAll,
  searchMovies,
  searchSeries,
  searchGames,
  getMovieDetail,
  getSeriesDetail,
  getGameDetail,
  getTrending
}