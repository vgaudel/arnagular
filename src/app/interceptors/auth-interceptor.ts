import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { API_URL, AuthService } from '../services/auth-service';

// Un intercepteur s'intercale entre l'application et le réseau : CHAQUE requête HttpClient
// passe par lui. On y ajoute l'en-tête Authorization une seule fois pour toute l'application,
// au lieu de le répéter dans chaque service.
export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const token = auth.getToken();

    // Pas de token, ou requête vers un autre serveur : on ne transmet surtout pas notre token à un tiers.
    if (!token || !req.url.startsWith(API_URL)) {
        return next(req);
    }

    // Une requête est IMMUABLE : on en fabrique une copie qui porte l'en-tête.
    const authReq = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });

    return next(authReq).pipe(
        catchError((error: unknown) => {
            // Le serveur refuse notre token (expiré, clé changée...) : on se déconnecte proprement.
            if (error instanceof HttpErrorResponse && error.status === 401) {
                auth.logout();
                router.navigate(['/login'], { queryParams: { retour: router.url } });
            }
            return throwError(() => error);
        })
    );
};
