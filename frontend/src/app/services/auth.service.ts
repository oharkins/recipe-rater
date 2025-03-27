import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User, AuthResponse } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/auth`;
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUser();
  }

  loadUser(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const user: User = JSON.parse(userJson);
      this.userSubject.next(user);
    }
  }

  register(user: User): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, user)
      .pipe(
        tap(response => {
          this.storeUserData(response);
        }),
        catchError(error => {
          return throwError(() => error.error.message || 'Registration failed');
        })
      );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          this.storeUserData(response);
        }),
        catchError(error => {
          return throwError(() => error.error.message || 'Login failed');
        })
      );
  }

  logout(): void {
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }

  private storeUserData(authResponse: AuthResponse): void {
    localStorage.setItem('user', JSON.stringify(authResponse));
    this.userSubject.next(authResponse);
  }

  get currentUser(): User | null {
    return this.userSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  get isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  get token(): string | null {
    return this.currentUser?.token || null;
  }
} 