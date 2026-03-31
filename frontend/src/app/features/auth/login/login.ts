import { Component, EventEmitter, Output } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { AuthService } from '../../../core/services/auth'
import { Router } from '@angular/router'
import { AlertComponent } from '../../../shared/components/alert/alert.component'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, AlertComponent],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {

  @Output() closed = new EventEmitter<void>()
  @Output() switchToRegister = new EventEmitter<void>()

  email = ''
  password = ''
  showPassword = false
  isLoading = false
  emailError = ''
  passwordError = ''
  alertVisible = false
  alertMessage = ''
  alertType: 'success' | 'error' = 'success'

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  validateEmail(): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!this.email) {
      this.emailError = 'El correo es obligatorio.'
    } else if (!emailRegex.test(this.email)) {
      this.emailError = 'Introduce un correo válido.'
    } else {
      this.emailError = ''
    }
  }

  validatePassword(): void {
    if (!this.password) {
      this.passwordError = 'La contraseña es obligatoria.'
    } else if (this.password.length < 6) {
      this.passwordError = 'Mínimo 6 caracteres.'
    } else {
      this.passwordError = ''
    }
  }

  isValid(): boolean {
    this.validateEmail()
    this.validatePassword()
    return !this.emailError && !this.passwordError
  }

  async onSubmit(): Promise<void> {
    if (!this.isValid()) return
    this.isLoading = true

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.isLoading = false
        this.alertType = 'success'
        this.alertMessage = '¡Bienvenido de vuelta a Trackr!'
        this.alertVisible = true
      },
      error: (err) => {
        this.isLoading = false
        this.alertType = 'error'
        const msg = err.error?.error || ''
        this.alertMessage = msg.includes('Credenciales')
          ? 'Email o contraseña incorrectos. Inténtalo de nuevo.'
          : 'Error al iniciar sesión. Inténtalo más tarde.'
        this.alertVisible = true
      }
    })
  }

  onAlertClosed(): void {
    this.alertVisible = false
    if (this.alertType === 'success') {
      this.close()
      this.router.navigate(['/'])
    }
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('overlay')) {
      this.close()
    }
  }

  close(): void {
    this.email = ''
    this.password = ''
    this.emailError = ''
    this.passwordError = ''
    this.isLoading = false
    this.closed.emit()
  }

  goToRegister(): void {
    this.switchToRegister.emit()
  }
}