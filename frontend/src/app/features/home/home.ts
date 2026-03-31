import { Component, OnInit } from '@angular/core'
import { ContentService, TrendingResults } from '../../core/services/content'
import { ContentCard } from '../../shared/components/content-card/content-card'
import { ModalService } from '../../core/services/modal'

@Component({
  selector: 'app-home',
  imports: [ContentCard],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {
  trending: TrendingResults | null = null
  loading = true

  constructor(
    private contentService: ContentService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.contentService.getTrending().subscribe({
      next: data => {
        this.trending = data
        this.loading = false
      },
      error: () => {
        this.loading = false
      }
    })
  }

  showLogin() {
    this.modalService.showLogin()
  }

  showRegister() {
    this.modalService.showRegister()
  }
}