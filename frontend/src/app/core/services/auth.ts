import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject, Observable, tap } from 'rxjs'
import { environment } from '../../../environments/environment'

export interface User {
  id: string
  username: string
  email: string
  avatar_url?: string
  bio?: string
}

export interface AuthResponse {
  token: string
  user: User
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`
  private userSubject = new BehaviorSubject<User | null>(null)

  user$ = this.userSubject.asObservable()

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    if (token && user) {
      this.userSubject.next(JSON.parse(user))
    }
  }

  register(username: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, { username, email, password })
      .pipe(tap(res => this.saveSession(res)))
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(tap(res => this.saveSession(res)))
  }

  logout(): void {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    this.userSubject.next(null)
  }

  getToken(): string | null {
    return localStorage.getItem('token')
  }

  isLoggedIn(): boolean {
    return !!this.getToken()
  }

  getCurrentUser(): User | null {
    return this.userSubject.value
  }

  private saveSession(res: AuthResponse): void {
    localStorage.setItem('token', res.token)
    localStorage.setItem('user', JSON.stringify(res.user))
    this.userSubject.next(res.user)
  }
}