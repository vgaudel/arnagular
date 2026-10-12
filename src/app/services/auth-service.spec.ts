import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth-service';

// Fabrique un faux JWT (la signature n'est pas vérifiée côté client).
function fakeToken(payload: object): string {
  const toBase64Url = (obj: object) =>
    btoa(String.fromCharCode(...new TextEncoder().encode(JSON.stringify(obj))))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `${toBase64Url({ alg: 'HS256', typ: 'JWT' })}.${toBase64Url(payload)}.signature`;
}

const inOneHour = () => Math.floor(Date.now() / 1000) + 3600;

describe('AuthService', () => {
  function createService(): AuthService {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    return TestBed.inject(AuthService);
  }

  beforeEach(() => localStorage.clear());

  it('est déconnecté par défaut', () => {
    const service = createService();
    expect(service.isLoggedIn()).toBe(false);
    expect(service.getToken()).toBeNull();
    expect(service.currentUser()).toBeNull();
  });

  it('login mémorise le token et déduit l\'utilisateur (accents compris)', () => {
    const service = createService();
    const http = TestBed.inject(HttpTestingController);
    const token = fakeToken({ sub: '1', username: 'Éloïse', role: 'user', iat: 0, exp: inOneHour() });

    service.login({ username: 'Éloïse', password: 'secret1234' }).subscribe();
    http.expectOne('http://localhost:3000/auth/login').flush({ token, user: { id: '1', username: 'Éloïse', role: 'user' } });

    expect(service.isLoggedIn()).toBe(true);
    expect(service.getToken()).toBe(token);
    expect(service.currentUser()?.username).toBe('Éloïse');
    expect(localStorage.getItem('auth.token')).toBe(token);
  });

  it('logout efface le token', () => {
    localStorage.setItem('auth.token', fakeToken({ sub: '1', username: 'a', role: 'user', iat: 0, exp: inOneHour() }));
    const service = createService();
    expect(service.isLoggedIn()).toBe(true);

    service.logout();

    expect(service.isLoggedIn()).toBe(false);
    expect(localStorage.getItem('auth.token')).toBeNull();
  });

  it('ignore un token expiré présent dans le localStorage', () => {
    localStorage.setItem('auth.token', fakeToken({ sub: '1', username: 'a', role: 'user', iat: 0, exp: 1 }));
    const service = createService();
    expect(service.isLoggedIn()).toBe(false);
  });
});
