import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '../../../environments/environment'

export interface ContentItem {
  id: string
  external_id: string
  type: 'movie' | 'series' | 'game'
  title: string
  overview: string
  poster_url: string | null
  backdrop_url: string | null
  release_date: string
  genres: any[]
  rating: number | null
  platforms?: string[]  // ← añadido, opcional para que no rompa movies/series
}

export interface SearchResults {
  movies: ContentItem[]
  series: ContentItem[]
  games: ContentItem[]
}

export interface TrendingResults {
  movies: ContentItem[]
  series: ContentItem[]
  games: ContentItem[]
}

@Injectable({ providedIn: 'root' })
export class ContentService {
  private apiUrl = `${environment.apiUrl}/content`

  constructor(private http: HttpClient) {}

  searchAll(query: string): Observable<SearchResults> {
    return this.http.get<SearchResults>(`${this.apiUrl}/search`, {
      params: { q: query }
    })
  }

  searchByType(query: string, type: string, page = 1): Observable<ContentItem[]> {
    return this.http.get<ContentItem[]>(`${this.apiUrl}/search`, {
      params: { q: query, type, page }
    })
  }

  getTrending(): Observable<TrendingResults> {
    return this.http.get<TrendingResults>(`${this.apiUrl}/trending`)
  }

  getMovieDetail(id: string): Observable<ContentItem> {
    return this.http.get<ContentItem>(`${this.apiUrl}/movie/${id}`)
  }

  getSeriesDetail(id: string): Observable<ContentItem> {
    return this.http.get<ContentItem>(`${this.apiUrl}/series/${id}`)
  }

  getGameDetail(id: string): Observable<ContentItem> {
    return this.http.get<ContentItem>(`${this.apiUrl}/game/${id}`)
  }

  getMovieProviders(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/movie/${id}/providers`)
  }

  getSeriesProviders(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/series/${id}/providers`)
  }
}