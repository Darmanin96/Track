import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '../../../environments/environment'

export interface LibraryEntry {
  id: string
  content_id: string
  status: string
  score: number | null
  review: string | null
  started_at: string | null
  finished_at: string | null
  title: string
  type: string
  poster_url: string | null
  genres: any[]
  global_rating: number | null
  created_at: string
  updated_at: string
}

export interface LibraryStats {
  type: string
  status: string
  count: number
  avg_score: number | null
}

@Injectable({ providedIn: 'root' })
export class LibraryService {
  private apiUrl = `${environment.apiUrl}/library`

  constructor(private http: HttpClient) {}

  getLibrary(type?: string, status?: string): Observable<LibraryEntry[]> {
    let params: any = {}
    if (type) params['type'] = type
    if (status) params['status'] = status
    return this.http.get<LibraryEntry[]>(this.apiUrl, { params })
  }

  getStats(): Observable<LibraryStats[]> {
    return this.http.get<LibraryStats[]>(`${this.apiUrl}/stats`)
  }

  addToLibrary(contentId: string, status: string, score?: number, review?: string): Observable<LibraryEntry> {
    return this.http.post<LibraryEntry>(this.apiUrl, { contentId, status, score, review })
  }

  updateEntry(contentId: string, updates: Partial<LibraryEntry>): Observable<LibraryEntry> {
    return this.http.patch<LibraryEntry>(`${this.apiUrl}/${contentId}`, updates)
  }

  removeFromLibrary(contentId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${contentId}`)
  }
}