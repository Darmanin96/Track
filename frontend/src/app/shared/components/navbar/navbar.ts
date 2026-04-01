import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { Router, RouterLink } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { AuthService } from '../../../core/services/auth'
import { LoginComponent } from '../../../features/auth/login/login'
import { RegisterComponent } from '../../../features/auth/register/register'
import { AlertComponent } from '../../../shared/components/alert/alert.component'
import { ContentService } from '../../../core/services/content'

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, FormsModule, LoginComponent, RegisterComponent, AlertComponent],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar implements OnInit {
  @Output() openLogin = new EventEmitter<void>()
  @Output() openRegister = new EventEmitter<void>()

  suggestions: any[] = []
  showSuggestions = false
  searchTimeout: any = null
  searchQuery = ''
  isLoggedIn = false
  username = ''
  menuOpen = false
  showLogin = false
  showRegister = false

  // Confirmación de logout
  showLogoutConfirm = false

  constructor(
    private authService: AuthService,
    private router: Router,
    private contentService: ContentService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.isLoggedIn = !!user
      this.username = user?.username || ''
    })
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], {
        queryParams: { q: this.searchQuery.trim() }
      })
      this.searchQuery = ''
      this.closeMenu()
    }
  }

  // Abre el diálogo de confirmación en lugar de cerrar sesión directamente
  requestLogout(): void {
    this.showLogoutConfirm = true
  }

  // Se llama cuando el usuario confirma en el diálogo
  confirmLogout(): void {
    this.showLogoutConfirm = false
    this.authService.logout()
    this.router.navigate(['/'])
    this.closeMenu()
  }

  // Se llama cuando el usuario cancela
  cancelLogout(): void {
    this.showLogoutConfirm = false
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen
  }

  closeMenu(): void {
    this.menuOpen = false
  }

  openLoginModal(): void {
  this.showLogin = true
  this.closeMenu()
}

  openRegisterModal(): void {
    this.showRegister = true
    this.closeMenu()
  }

  onNavInputChange(): void {
    if (!this.searchQuery.trim()) {
      this.suggestions = []
      this.showSuggestions = false
      return
    }
    clearTimeout(this.searchTimeout)
    this.searchTimeout = setTimeout(() => {
      this.contentService.searchAll(this.searchQuery).subscribe({
        next: (data: any) => {
          this.suggestions = [
            ...data.movies.slice(0, 2),
            ...data.series.slice(0, 2),
            ...data.games.slice(0, 2)
          ]
          this.showSuggestions = this.suggestions.length > 0
        },
        error: () => {}
      })
    }, 400)
  }

  selectSuggestion(item: any): void {
    this.showSuggestions = false
    this.suggestions = []
    this.searchQuery = ''
    this.router.navigate(['/detail', item.type, item.external_id])
  }

  hideSuggestions(): void {
    setTimeout(() => this.showSuggestions = false, 200)
  }

  getTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      movie: 'Película',
      series: 'Serie',
      game: 'Juego'
    }
    return labels[type] || type
  }
}