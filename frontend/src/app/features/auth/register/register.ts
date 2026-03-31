import { Component, EventEmitter, Output } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { AuthService } from '../../../core/services/auth'
import { Router } from '@angular/router'
import { AlertComponent } from '../../../shared/components/alert/alert.component'

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, AlertComponent],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent {

  @Output() closed = new EventEmitter<void>()
  @Output() switchToLogin = new EventEmitter<void>()

  username = ''
  email = ''
  password = ''
  confirm = ''
  showPassword = false
  isLoading = false
  usernameError = ''
  emailError = ''
  passwordError = ''
  confirmError = ''
  strengthClass = ''
  strengthLabel = ''
  alertVisible = false
  alertMessage = ''
  alertType: 'success' | 'error' = 'success'

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  validateUsername(): void {
    if (!this.username.trim()) {
      this.usernameError = 'El nombre de usuario es obligatorio.'
    } else if (this.username.length < 3) {
      this.usernameError = 'Mínimo 3 caracteres.'
    } else if (!/^[a-zA-Z0-9_]+$/.test(this.username)) {
      this.usernameError = 'Solo letras, números y guion bajo.'
    } else {
      this.usernameError = ''
    }
  }

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

  validateConfirm(): void {
    if (!this.confirm) {
      this.confirmError = 'Confirma tu contraseña.'
    } else if (this.confirm !== this.password) {
      this.confirmError = 'Las contraseñas no coinciden.'
    } else {
      this.confirmError = ''
    }
  }

  updateStrength(): void {
    const p = this.password
    if (!p) { this.strengthClass = ''; this.strengthLabel = ''; return }
    let score = 0
    if (p.length >= 8) score++
    if (/[A-Z]/.test(p)) score++
    if (/[0-9]/.test(p)) score++
    if (/[^a-zA-Z0-9]/.test(p)) score++
    if (score <= 1) { this.strengthClass = 'weak'; this.strengthLabel = 'Débil' }
    else if (score <= 3) { this.strengthClass = 'medium'; this.strengthLabel = 'Media' }
    else { this.strengthClass = 'strong'; this.strengthLabel = 'Fuerte' }
  }

  isValid(): boolean {
    this.validateUsername()
    this.validateEmail()
    this.validatePassword()
    this.validateConfirm()
    return !this.usernameError && !this.emailError && !this.passwordError && !this.confirmError
  }

  async onSubmit(): Promise<void> {
    if (!this.isValid()) return
    this.isLoading = true

    this.authService.register(this.username, this.email, this.password).subscribe({
      next: () => {
        this.isLoading = false
        this.alertType = 'success'
        this.alertMessage = '¡Cuenta creada correctamente! Bienvenido a Trackr.'
        this.alertVisible = true
      },
      error: (err) => {
        this.isLoading = false
        this.alertType = 'error'
        const msg = err.error?.error || ''
        this.alertMessage = msg.includes('ya existe')
          ? 'Este email o usuario ya está registrado.'
          : 'Error al crear la cuenta. Inténtalo de nuevo.'
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
    this.username = ''
    this.email = ''
    this.password = ''
    this.confirm = ''
    this.usernameError = ''
    this.emailError = ''
    this.passwordError = ''
    this.confirmError = ''
    this.strengthClass = ''
    this.strengthLabel = ''
    this.isLoading = false
    this.closed.emit()
  }

  goToLogin(): void {
    this.switchToLogin.emit()
  }
}