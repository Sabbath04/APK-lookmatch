import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequestDTO } from '../models/login-request.dto';
import { LoginResponseDTO } from '../models/login-response.dto';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequestDTO): Observable<LoginResponseDTO> {
    return this.http.post<LoginResponseDTO>(this.apiUrl, credentials, {
      withCredentials: true,
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  setToken(token: string) {
    localStorage.setItem('jwt', token);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  logout() {
    localStorage.removeItem('jwt');
  }
}
