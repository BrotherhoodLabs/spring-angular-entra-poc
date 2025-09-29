import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  provider: 'LOCAL' | 'MICROSOFT';
  createdAt: string;
  claims?: any;
}

export interface SecureData {
  message: string;
  timestamp: string;
  user: any;
  data: any;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiConfig.uri;

  constructor(private http: HttpClient) { }

  register(request: RegisterRequest): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/api/auth/register`, request);
  }

  getMe(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/api/me`);
  }

  getSecureData(): Observable<SecureData> {
    return this.http.get<SecureData>(`${this.baseUrl}/api/secure-data`);
  }

  getHealth(): Observable<any> {
    return this.http.get(`${this.baseUrl}/actuator/health`);
  }
}
