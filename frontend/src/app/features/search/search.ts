import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { ContentService, ContentItem } from '../../core/services/content'
import { ContentCard } from '../../shared/components/content-card/content-card'

interface AllResults {
  movies: ContentItem[]
  series: ContentItem[]
  games: ContentItem[]
}

@Component({
  selector: 'app-search',
  imports: [FormsModule, ContentCard],
  templateUrl: './search.html',
  styleUrl: './search.scss'
})
export class Search implements OnInit {
  query = ''
  results: AllResults | null = null
  loading = false
  searched = false
  activeFilter = 'all'
  suggestions: ContentItem[] = []
  showSuggestions = false
  searchTimeout: any = null
  

  get totalResults(): number {
    if (!this.results) return 0
    return (this.results.movies?.length || 0) +
           (this.results.series?.length || 0) +
           (this.results.games?.length || 0)
  }

  constructor(
    private contentService: ContentService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.query = params['q']
        this.onSearch()
      }
    })
  }

  onSearch(): void {
    if (!this.query.trim()) return
    this.loading = true
    this.searched = true
    this.results = null
    this.showSuggestions = false

    this.router.navigate([], {
      queryParams: { q: this.query },
      replaceUrl: true
    })

    this.contentService.searchAll(this.query).subscribe({
      next: data => {
        this.results = data as AllResults
        this.loading = false
      },
      error: () => {
        this.loading = false
      }
    })
  }

  onInputChange(): void {
    if (!this.query.trim()) {
      this.results = null
      this.searched = false
      this.suggestions = []
      this.showSuggestions = false
      return
    }
    clearTimeout(this.searchTimeout)
    this.searchTimeout = setTimeout(() => {
      this.loadSuggestions()
    }, 400)
  }

  loadSuggestions(): void {
    if (!this.query.trim()) return
    this.contentService.searchAll(this.query).subscribe({
      next: data => {
        const all = [
          ...(data as AllResults).movies.slice(0, 3),
          ...(data as AllResults).series.slice(0, 3),
          ...(data as AllResults).games.slice(0, 3)
        ]
        this.suggestions = all
        this.showSuggestions = all.length > 0
      },
      error: () => {}
    })
  }

  selectSuggestion(item: ContentItem): void {
    this.showSuggestions = false
    this.suggestions = []
    this.router.navigate(['/detail', item.type, item.external_id])
  }

  hideSuggestions(): void {
    setTimeout(() => {
      this.showSuggestions = false
    }, 200)
  }

  setFilter(filter: string): void {
    this.activeFilter = filter
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