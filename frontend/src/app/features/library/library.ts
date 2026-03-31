import { Component, OnInit } from '@angular/core'
import { Router, RouterLink } from '@angular/router'
import { LibraryService, LibraryEntry, LibraryStats } from '../../core/services/library'

@Component({
  selector: 'app-library',
  imports: [RouterLink],
  templateUrl: './library.html',
  styleUrl: './library.scss'
})
export class Library implements OnInit {
  entries: LibraryEntry[] = []
  filteredEntries: LibraryEntry[] = []
  stats: LibraryStats[] = []
  loading = true
  activeType = 'all'
  activeStatus = 'all'

  constructor(
    private libraryService: LibraryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLibrary()
    this.loadStats()
  }

  loadLibrary(): void {
    this.loading = true
    this.libraryService.getLibrary().subscribe({
      next: data => {
        this.entries = data
        this.applyFilters()
        this.loading = false
      },
      error: () => {
        this.loading = false
      }
    })
  }

  loadStats(): void {
    this.libraryService.getStats().subscribe({
      next: data => this.stats = data,
      error: () => {}
    })
  }

  applyFilters(): void {
    this.filteredEntries = this.entries.filter(entry => {
      const typeMatch = this.activeType === 'all' || entry.type === this.activeType
      let statusMatch = this.activeStatus === 'all' || entry.status === this.activeStatus
      if (this.activeStatus === 'watching' && entry.status === 'playing') {
        statusMatch = true
      }
      return typeMatch && statusMatch
    })
  }

  setType(type: string): void {
    this.activeType = type
    this.applyFilters()
  }

  setStatus(status: string): void {
    this.activeStatus = status
    this.applyFilters()
  }

  goToDetail(entry: LibraryEntry): void {
    this.router.navigate(['/detail', entry.type, entry.content_id.split('_')[1]])
  }

  getTotalByType(type: string): number {
    return this.stats
      .filter(s => s.type === type)
      .reduce((sum, s) => sum + Number(s.count), 0)
  }

  getAvgScore(): string {
    const scores = this.stats.filter(s => s.avg_score !== null)
    if (scores.length === 0) return '—'
    const avg = scores.reduce((sum, s) => sum + Number(s.avg_score), 0) / scores.length
    return avg.toFixed(1)
  }

  getTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      movie: 'Película',
      series: 'Serie',
      game: 'Juego'
    }
    return labels[type] || type
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      watching: 'Viendo',
      completed: 'Completado',
      pending: 'Pendiente',
      abandoned: 'Abandonado',
      playing: 'Jugando',
      played: 'Completado'
    }
    return labels[status] || status
  }
}