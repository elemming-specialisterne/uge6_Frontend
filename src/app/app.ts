import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Warehouse_Frontend');

  toggleLoginModal(): void {
	const loginModal = document.getElementById('login-modal');
	if (loginModal) {
		loginModal.classList.toggle('show');
	}
  }
}
