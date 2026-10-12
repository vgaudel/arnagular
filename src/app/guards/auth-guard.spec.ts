import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { authGuard } from './auth-guard';
import { AuthService } from '../services/auth-service';

describe('authGuard', () => {
  function runGuard(loggedIn: boolean) {
    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: { isLoggedIn: () => loggedIn } }],
    });
    return TestBed.runInInjectionContext(() =>
      authGuard({} as never, { url: '/produitsv2' } as never)
    );
  }

  it('autorise l\'accès si l\'utilisateur est connecté', () => {
    expect(runGuard(true)).toBe(true);
  });

  it('redirige vers /login en mémorisant la page demandée sinon', () => {
    const result = runGuard(false);
    expect(result).toBeInstanceOf(UrlTree);
    expect(TestBed.inject(Router).serializeUrl(result as UrlTree)).toBe('/login?retour=%2Fproduitsv2');
  });
});
