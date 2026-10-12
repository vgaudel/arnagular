export type Role = 'user' | 'admin';

// Utilisateur tel que renvoyé par l'API (jamais de mot de passe).
export interface IPublicUser {
    id: string;
    username: string;
    role: Role;
}

// Corps envoyé à POST /auth/login.
export interface ILoginRequest {
    username: string;
    password: string;
}

// Réponse de POST /auth/login.
export interface ILoginResponse {
    token: string;
    user: IPublicUser;
}

// Contenu (payload) lisible à l'intérieur du token JWT.
// iat / exp sont en SECONDES depuis 1970 (et non en millisecondes).
export interface IJwtPayload {
    sub: string;
    username: string;
    role: Role;
    iat: number;
    exp: number;
}
