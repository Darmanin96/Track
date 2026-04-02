import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class UiService {
  openLogin$ = new Subject<void>()

  openLogin(): void {
    this.openLogin$.next()
  }
}