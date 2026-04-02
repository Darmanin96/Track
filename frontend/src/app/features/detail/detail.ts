import { Component, OnInit, ChangeDetectorRef } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { ContentService, ContentItem } from '../../core/services/content'
import { LibraryService } from '../../core/services/library'
import { AuthService } from '../../core/services/auth'
import { AlertComponent } from '../../shared/components/alert/alert.component'


@Component({
  selector: 'app-detail',
  imports: [FormsModule, CommonModule, AlertComponent],
  templateUrl: './detail.html',
  styleUrl: './detail.scss'
})
export class Detail implements OnInit {
  item: ContentItem | null = null
  loading = true
  selectedStatus = ''
  saving = false
  isLoggedIn = false

  // Rating
  userRating = 0
  hoverRating = 0
  stars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  // Alerta
  alertVisible = false
  alertMessage = ''
  alertType: 'success' | 'error' = 'success'

  get isCompleted(): boolean {
    return this.selectedStatus === 'completed' || this.selectedStatus === 'played'
  }

  constructor(
    private route: ActivatedRoute,
    private contentService: ContentService,
    private libraryService: LibraryService,
    private authService: AuthService,
     private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn()

    this.route.params.subscribe(params => {
      const type = params['type']
      const id = params['id']
      this.loadContent(type, id)
    })
  }

providers: any = null
  
  loadContent(type: string, id: string): void {
    this.loading = true
    this.item = null
    this.providers = null

    let request$

    if (type === 'movie') {
      request$ = this.contentService.getMovieDetail(id)
    } else if (type === 'series') {
      request$ = this.contentService.getSeriesDetail(id)
    } else {
      request$ = this.contentService.getGameDetail(id)
    }

    
    
  request$.subscribe({
    next: data => {
      this.item = data
      this.loading = false
      // Cargar proveedores para películas y series
      if (type === 'movie') {
        this.contentService.getMovieProviders(id).subscribe({
          next: p => {
            console.log('Proveedores de película:', p)
            this.providers = p
            this.cdr.detectChanges()
          },
           error: (e) => console.error('Error providers:', e)  
        })
      } else if (type === 'series') {
        this.contentService.getSeriesProviders(id).subscribe({
          next: p => {
            this.providers = p
            this.cdr.detectChanges()  // ← añade
          },
          error: () => {}
        })
      }
    },
    error: () => { this.loading = false }
  })
  }

  onStatusChange(): void {
    if (!this.isCompleted) {
      this.userRating = 0
      this.hoverRating = 0
    }
  }

  setRating(value: number): void {
    this.userRating = this.userRating === value ? 0 : value
  }

  showAlert(message: string, type: 'success' | 'error'): void {
    this.alertMessage = message
    this.alertType = type
    this.alertVisible = true
  }

  addToLibrary(): void {
    if (!this.isLoggedIn) {
      this.showAlert('Inicia sesión para añadir a tu biblioteca', 'error')
      return
    }
    if (!this.selectedStatus || !this.item) return

    this.saving = true

    this.libraryService.addToLibrary(
      this.item.id,
      this.selectedStatus,
      this.isCompleted && this.userRating > 0 ? this.userRating : undefined
    ).subscribe({
      next: () => {
        this.saving = false
        const msg = this.userRating > 0
          ? `Guardado con puntuación ${this.userRating}/10`
          : 'Añadido a tu biblioteca'
        this.showAlert(msg, 'success')
      },
      error: () => {
        this.saving = false
        this.showAlert('Error al guardar. Inténtalo de nuevo.', 'error')
      }
    })
  }

  getTypeLabel(): string {
    const labels: Record<string, string> = {
      movie: 'Película',
      series: 'Serie',
      game: 'Juego'
    }
    return labels[this.item?.type || ''] || ''
  }

  getYear(): string {
    if (!this.item?.release_date) return ''
    return new Date(this.item.release_date).getFullYear().toString()
  }
}