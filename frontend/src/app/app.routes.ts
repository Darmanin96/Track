import { Routes } from '@angular/router'
import { authGuard } from './core/guards/auth-guard'

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then(m => m.Home)
  },
  {
    path: 'search',
    loadComponent: () => import('./features/search/search').then(m => m.Search)
  },
  {
    path: 'detail/:type/:id',
    loadComponent: () => import('./features/detail/detail').then(m => m.Detail)
  },
  {
    path: 'library',
    loadComponent: () => import('./features/library/library').then(m => m.Library),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
]