import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from './services/auth/auth-service';
import { ProductListComponent } from "./product-list-component/product-list-component";
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [CommonModule, ReactiveFormsModule, ProductListComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  protected readonly title = signal('Warehouse_Frontend');
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });
  loginModalVisible = signal(false);

  constructor(public authService: AuthService) {
  }

  toggleLoginModal(): void {
	// const loginModal = document.getElementById('login-modal');
  //   if (loginModal) {
  //     loginModal.classList.toggle('show');
  //     console.log(this.loginForm.valid);
  //   }
  this.loginModalVisible.set(!this.loginModalVisible());
  }

  onSubmit(): void {
    const loginModal = document.getElementById('login-modal');
    const loginButton = document.getElementById('login-button');

    console.log(this.loginForm.value);

    this.authService.login(this.loginForm.value.email!, this.loginForm.value.password!)
    .then(response => {
      console.log('Login successful:', response);

      if (loginModal) {
        loginModal.classList.add('success');
        if (loginButton) {
          loginButton.setAttribute('disabled', '');
        }
      }
      setTimeout(() => {
        this.toggleLoginModal();

        setTimeout(() => {
          if (loginModal) {
            loginModal.classList.remove('success');
          }

          if (loginButton) {
            loginButton.removeAttribute('disabled');
          }
        }, 400);

      }, 800);

    })
    .catch(error => {
      console.error('Login failed:', error);
    });
  }
}
