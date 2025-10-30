import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Component({
  selector: 'app-auth',
  imports: [],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {
	private accessToken: string | null = null;
	private userSubject = new BehaviorSubject<string | null>(null);
	public currentUser$ = this.userSubject.asObservable();

	constructor(private http: HttpClient) {
		
	}

	protected login(username: string, password: string): Observable<LoginResponse> {

		return this.http.post<LoginResponse>('http://localhost:5028/auth/login',
			{ username, password },
			{ withCredentials: true }
		).pipe(tap(res => {
			this.accessToken = res.access_token;
			const payload = JSON.parse(atob(res.access_token.split('.')[1]));
			this.userSubject.next(payload.username);
		}));

		// Simulate an API call
		// if (username === 'user' && password === 'password') {
		// 	this.accessToken = 'fake-jwt-token';
		// 	this.userSubject.next(username);
		// }
	}

	getAccessToken(): string | null {
		return this.accessToken;
	}

	protected logout(): Observable<Object> {
		return this.http.post('http://localhost:5028/auth/logout',
			{},
			{ withCredentials: true }
		).pipe(tap(() => {
			this.accessToken = null;
			this.userSubject.next(null);
		}));
	}
}
