import { HttpClient } from '@angular/common/http';
import { computed, inject, Service, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { IJwtPayload, ILoginRequest, ILoginResponse, IPublicUser } from '../model/IAuth';

export const API_URL = 'http://localhost:3000';

// Clé sous laquelle le token survit à un rechargement de la page.
const TOKEN_STORAGE_KEY = 'auth.token';

// Lit le payload d'un JWT. ATTENTION : on ne VÉRIFIE pas la signature (le client n'a pas la clé
// secrète), on se contente de lire. Seul le serveur peut juger de l'authenticité d'un token.
function decodePayload(token: string): IJwtPayload | null {
    try {
        // Le payload est du Base64URL : on le convertit en Base64 standard avant atob().
        const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        // atob renvoie du Latin-1 : on repasse par des octets pour décoder correctement l'UTF-8 (accents).
        const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
        return JSON.parse(new TextDecoder().decode(bytes));
    } catch {
        return null;
    }
}

function isExpired(token: string): boolean {
    const payload = decodePayload(token);
    // exp est en secondes, Date.now() en millisecondes.
    return !payload || payload.exp * 1000 <= Date.now();
}

@Service()
export class AuthService {

    private http = inject(HttpClient);

    // Source de vérité : le token. Au démarrage on le relit, sauf s'il a expiré entre-temps.
    private token = signal<string | null>(this.readStoredToken());

    // Utilisateur connecté, déduit du token : il reste disponible après un rechargement de page.
    currentUser = computed<IPublicUser | null>(() => {
        const token = this.token();
        const payload = token ? decodePayload(token) : null;
        return payload ? { id: payload.sub, username: payload.username, role: payload.role } : null;
    });

    // Lit le signal token : un template qui l'appelle se met donc à jour à la connexion/déconnexion.
    isLoggedIn(): boolean {
        const token = this.token();
        return token !== null && !isExpired(token);
    }

    // Renvoie le token seulement s'il est encore valide (utilisé par l'intercepteur).
    getToken(): string | null {
        return this.isLoggedIn() ? this.token() : null;
    }

    login(credentials: ILoginRequest): Observable<ILoginResponse> {
        return this.http
            .post<ILoginResponse>(`${API_URL}/auth/login`, credentials)
            .pipe(tap((response) => this.setToken(response.token)));
    }

    logout(): void {
        this.setToken(null);
    }

    private setToken(token: string | null): void {
        this.token.set(token);
        if (token) {
            localStorage.setItem(TOKEN_STORAGE_KEY, token);
        } else {
            localStorage.removeItem(TOKEN_STORAGE_KEY);
        }
    }

    private readStoredToken(): string | null {
        const token = localStorage.getItem(TOKEN_STORAGE_KEY);
        return token && !isExpired(token) ? token : null;
    }
}
