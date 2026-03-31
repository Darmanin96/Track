import { Component, Input } from '@angular/core'
import { Router } from '@angular/router'
import { ContentItem } from '../../../core/services/content'

@Component({
  selector: 'app-content-card',
  imports: [],
  templateUrl: './content-card.html',
  styleUrl: './content-card.scss'
})
export class ContentCard {
  @Input() item!: ContentItem

  constructor(private router: Router) {}

  onCardClick(): void {
    this.router.navigate(['/detail', this.item.type, this.item.external_id])
  }

  getTypeLabel(): string {
    const labels: Record<string, string> = {
      movie: 'Película',
      series: 'Serie',
      game: 'Juego'
    }
    return labels[this.item.type] || this.item.type
  }

  getYear(): string {
    if (!this.item.release_date) return ''
    return new Date(this.item.release_date).getFullYear().toString()
  }
}