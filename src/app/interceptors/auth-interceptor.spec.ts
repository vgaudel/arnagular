import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { authInterceptor } from './auth-interceptor';
import { AuthService } from '../services/auth-service';

describe('authInterceptor', () => {
  let http: HttpClient;
  let controller: HttpTestingController;
  let token: string | null;
  const logout = vi.fn();
  const navigate = vi.fn();

  beforeEach(() => {
    token = 'abc.def.ghi';
    logout.mockClear();
    navigate.mockClear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: { getToken: () => token, logout } },
        { provide: Router, useValue: { navigate, url: '/produitshttp' } },
      ],
    });
    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
  });

  it('ajoute l\'en-tête Authorization sur les requêtes vers l\'API', () => {
    http.get('http://localhost:3000/products').subscribe();
    const req = controller.expectOne('http://localhost:3000/products');
    expect(req.request.headers.get('Authorization')).toBe('Bearer abc.def.ghi');
  });

  it('n\'ajoute rien sans token', () => {
    token = null;
    http.get('http://localhost:3000/products').subscribe();
    expect(controller.expectOne('http://localhost:3000/products').request.headers.has('Authorization')).toBe(false);
  });

  it('n\'envoie jamais le token à un autre serveur', () => {
    http.get('https://autre-site.example/api').subscribe();
    expect(controller.expectOne('https://autre-site.example/api').request.headers.has('Authorization')).toBe(false);
  });

  it('déconnecte et redirige vers /login sur une réponse 401', () => {
    http.get('http://localhost:3000/products').subscribe({ error: () => {} });
    controller.expectOne('http://localhost:3000/products').flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(logout).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith(['/login'], { queryParams: { retour: '/produitshttp' } });
  });
});
