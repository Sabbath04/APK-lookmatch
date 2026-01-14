import { AuthService } from './auth.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LoginRequestDTO } from '../models/login-request.dto';
import { LoginResponseDTO } from '../models/login-response.dto';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login and return a token', () => {
    const credentials: LoginRequestDTO = { username: 'user', password: 'pass' };
    const mockResponse: LoginResponseDTO = {
      token: '123',
      user: {
        id: 1,
        username: 'user',
        roles: ['user']
      }
    };

    service.login(credentials).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should set, get and remove token', () => {
    service.setToken('abc');
    expect(service.getToken()).toBe('abc');
    service.logout();
    expect(service.getToken()).toBeNull();
  });
});
