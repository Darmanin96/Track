import { Component, OnInit } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { CommonModule } from '@angular/common'
import { Observable } from 'rxjs'
import { Navbar } from './shared/components/navbar/navbar'
import { RegisterComponent } from './features/auth/register/register'
import { LoginComponent } from './features/auth/login/login'
import { ModalService } from './core/services/modal'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, Navbar, RegisterComponent, LoginComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  title = 'trackr'
  showLogin$!: Observable<boolean>
  showRegister$!: Observable<boolean>

  constructor(private modalService: ModalService) {
    this.showLogin$ = this.modalService.showLogin$
    this.showRegister$ = this.modalService.showRegister$
  }

  ngOnInit() {}

  hideLogin() {
    this.modalService.hideLogin();
  }

  hideRegister() {
    this.modalService.hideRegister();
  }

  showRegisterFromLogin() {
    this.modalService.hideLogin();
    this.modalService.showRegister();
  }

  showLoginFromRegister() {
    this.modalService.hideRegister();
    this.modalService.showLogin();
  }
}