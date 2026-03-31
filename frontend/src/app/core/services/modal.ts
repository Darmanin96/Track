import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private showLoginSubject = new BehaviorSubject<boolean>(false);
  private showRegisterSubject = new BehaviorSubject<boolean>(false);

  showLogin$ = this.showLoginSubject.asObservable();
  showRegister$ = this.showRegisterSubject.asObservable();

  showLogin() {
    this.showLoginSubject.next(true);
  }

  showRegister() {
    this.showRegisterSubject.next(true);
  }

  hideLogin() {
    this.showLoginSubject.next(false);
  }

  hideRegister() {
    this.showRegisterSubject.next(false);
  }
}