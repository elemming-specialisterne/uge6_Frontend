import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../../models/user';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private accessToken: string | null = null;
	private userId: string | null = null;
	private userSubject = new BehaviorSubject<User | null>(null);
	public currentUser$ = this.userSubject.asObservable();

	constructor() {

	}

	public async login(email: string, password: string): Promise<LoginResponse> {

		return await this.api<LoginResponse>('POST', 'auth/login', { email, password })
			.then(response => {
				console.log(response);
				this.accessToken = response.access_token;
				const payload = JSON.parse(atob(response.access_token.split('.')[1]));
				console.log(payload);
				this.userSubject.next({
					id: response.user_id,
					username: payload.username,
					email: payload.email,
					role: payload.role
				});
				return response;
			})
			.catch(error => {
				console.error('Error:', error);
				return Promise.reject(error);
			});
	}

	getAccessToken(): string | null {
		return this.accessToken;
	}

	protected async logout(): Promise<void> {

		return await this.api<void>('POST', 'auth/logout', undefined)
			.then(response => {
				console.log(response);
				this.accessToken = null;
				this.userSubject.next(null);
				return response;
			})
			.catch(error => {
				console.error('Error:', error);
				return Promise.reject(error);
			});
	}

	protected async getUsers(amount: Number): Promise<void> {

		return await this.api<void>('GET', 'user/get', undefined)
			.then(response => {
				console.log(response);
				return response;
			})
			.catch(error => {
				console.error('Error:', error);
				return Promise.reject(error);
			});

		// return this.http.post('http://localhost:5028/auth/logout',
		// 	{},
		// 	{ withCredentials: true }
		// ).pipe(tap(() => {
		// 	this.accessToken = null;
		// 	this.userSubject.next(null);
		// }));
	}

	async api<T>(method: string, path: string, body: {} | undefined): Promise<T> {
		const BASE_URL = 'https://localhost:7252';
		const response = await fetch(`${BASE_URL}/${path}`, {
			method,
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify(body)
		});

		if (!response.ok) {
			throw new Error(response.statusText);
		}

		return await response.json() as T;
	}
}
