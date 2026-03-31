import { Component, Input, Output, EventEmitter } from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (visible) {
      <div class="alert-overlay" (click)="onOverlayClick()">
        <div class="alert-box"
          [class.alert-box--error]="type === 'error'"
          [class.alert-box--success]="type === 'success'"
          (click)="$event.stopPropagation()">

          <div class="alert-box__icon">
            {{ confirm ? '?' : (type === 'success' ? '✓' : '✕') }}
          </div>

          <p class="alert-box__message">{{ message }}</p>

          @if (confirm) {
            <!-- Modo confirmación: dos botones -->
            <div class="alert-box__actions">
              <button class="alert-box__btn alert-box__btn--cancel" (click)="onCancel()">
                Cancelar
              </button>
              <button class="alert-box__btn alert-box__btn--confirm" (click)="onConfirm()">
                {{ confirmLabel }}
              </button>
            </div>
          } @else {
            <!-- Modo alerta normal: un botón -->
            <button class="alert-box__btn" (click)="onClose()">Aceptar</button>
          }

        </div>
      </div>
    }
  `,
  styles: [`
    .alert-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      animation: fadeIn 0.2s ease;
    }

    .alert-box {
      background: #111;
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 16px;
      padding: 2rem;
      width: 100%;
      max-width: 360px;
      text-align: center;
      animation: slideUp 0.25s cubic-bezier(0.22, 1, 0.36, 1);
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.6);

      &--success {
        border-color: rgba(22, 163, 74, 0.3);
        box-shadow: 0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(22,163,74,0.15);
      }

      &--error {
        border-color: rgba(220, 38, 38, 0.3);
        box-shadow: 0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(220,38,38,0.15);
      }
    }

    .alert-box__icon {
      width: 52px;
      height: 52px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem;
      font-size: 1.4rem;
      font-weight: 700;
      background: rgba(220, 38, 38, 0.2);
      color: #f87171;
      border: 2px solid rgba(220, 38, 38, 0.4);

      .alert-box--success & {
        background: rgba(22, 163, 74, 0.2);
        color: #4ade80;
        border: 2px solid rgba(22, 163, 74, 0.4);
      }

      .alert-box--error & {
        background: rgba(220, 38, 38, 0.2);
        color: #f87171;
        border: 2px solid rgba(220, 38, 38, 0.4);
      }
    }

    .alert-box__message {
      color: #ccc;
      font-size: 1rem;
      line-height: 1.5;
      margin-bottom: 1.5rem;
    }

    /* ── Botones ── */
    .alert-box__actions {
      display: flex;
      gap: 12px;
      justify-content: center;
    }

    .alert-box__btn {
      border: none;
      border-radius: 10px;
      padding: 0.75rem 2rem;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.15s, box-shadow 0.2s;
      font-family: inherit;

      /* Botón único (modo alerta) */
      &:not(&--cancel):not(&--confirm) {
        background: linear-gradient(135deg, #dc2626, #b91c1c);
        color: white;
        box-shadow: 0 4px 20px rgba(220, 38, 38, 0.35);
        width: 100%;

        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 28px rgba(220, 38, 38, 0.45);
        }
      }

      &--cancel {
        background: rgba(255, 255, 255, 0.06);
        color: #aaa;
        flex: 1;

        &:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }
      }

      &--confirm {
        background: linear-gradient(135deg, #dc2626, #b91c1c);
        color: white;
        flex: 1;
        box-shadow: 0 4px 20px rgba(220, 38, 38, 0.35);

        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 28px rgba(220, 38, 38, 0.45);
        }
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px) scale(0.97); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
  `]
})
export class AlertComponent {
  @Input() message = ''
  @Input() type: 'success' | 'error' = 'error'
  @Input() visible = false

  /** Activa el modo confirmación (dos botones) */
  @Input() confirm = false
  @Input() confirmLabel = 'Confirmar'

  @Output() closed = new EventEmitter<void>()
  @Output() confirmed = new EventEmitter<void>()
  @Output() cancelled = new EventEmitter<void>()

  onClose(): void {
    this.visible = false
    this.closed.emit()
  }

  onConfirm(): void {
    this.visible = false
    this.confirmed.emit()
  }

  onCancel(): void {
    this.visible = false
    this.cancelled.emit()
  }

  onOverlayClick(): void {
    this.confirm ? this.onCancel() : this.onClose()
  }
}