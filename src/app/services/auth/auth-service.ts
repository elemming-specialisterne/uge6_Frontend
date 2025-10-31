import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
	private accessToken: string | null = null;
	private userSubject = new BehaviorSubject<string | null>(null);
	public currentUser$ = this.userSubject.asObservable();

	constructor() {

	}

	public async login(email: string, password: string): Promise<LoginResponse> {

		return await this.api<LoginResponse>('POST', 'auth/login', { email, password })
    .then(response => {
      console.log(response);
			this.accessToken = response.access_token;
			const payload = JSON.parse(atob(response.access_token.split('.')[1]));
			this.userSubject.next(this.accessToken);
      return response;
    })
    .catch(error => {
      console.error('Error:', error);
      return Promise.reject(error);
    });

		// return this.http.post<LoginResponse>('http://192.168.1.52:5028/auth/login',
		// 	{ username, password },
		// 	{ withCredentials: true }
		// ).pipe(tap(res => {
		// 			console.log(res);
		// 	this.accessToken = res.access_token;
		// 	const payload = JSON.parse(atob(res.access_token.split('.')[1]));
		// 	this.userSubject.next(payload.username);
		// }));

		// Simulate an API call
		// if (username === 'user' && password === 'password') {
		// 	this.accessToken = 'fake-jwt-token';
		// 	this.userSubject.next(username);
		// }
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

		// return this.http.post('http://localhost:5028/auth/logout',
		// 	{},
		// 	{ withCredentials: true }
		// ).pipe(tap(() => {
		// 	this.accessToken = null;
		// 	this.userSubject.next(null);
		// }));
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
    const BASE_URL = 'https://192.168.1.52:7252';
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

    //    And can also be used here ↴
    return await response.json() as T;
}
}
