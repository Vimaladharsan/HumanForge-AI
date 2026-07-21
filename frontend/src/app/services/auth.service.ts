import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface User {
  id: number;
  email: string;
  name: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface AuthResult {
  user: User;
  token: string;
}

const TOKEN_KEY = 'hf_token';
const USER_KEY = 'hf_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly base = 'http://localhost:5000/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(this.readStoredUser());
  readonly currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  private readStoredUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get token(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  get isLoggedIn(): boolean {
    return !!this.token;
  }

  register(email: string, password: string, name: string): Observable<ApiResponse<AuthResult>> {
    return this.http.post<ApiResponse<AuthResult>>(`${this.base}/register`, { email, password, name })
      .pipe(tap((res) => { if (res.success) this.persistSession(res.data); }));
  }

  login(email: string, password: string): Observable<ApiResponse<AuthResult>> {
    return this.http.post<ApiResponse<AuthResult>>(`${this.base}/login`, { email, password })
      .pipe(tap((res) => { if (res.success) this.persistSession(res.data); }));
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUserSubject.next(null);
  }

  private persistSession(data: AuthResult): void {
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    this.currentUserSubject.next(data.user);
  }
}
