import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATEUR PERSONNALISÉ (au niveau du FormGroup)
// ─────────────────────────────────────────────────────────────────────────────
// Certains contrôles ne concernent PAS un seul champ mais la RELATION entre
// plusieurs champs (ex : "le mot de passe et sa confirmation doivent être
// identiques", ou ici "le nom et la description doivent être DIFFÉRENTS").
//
// Ce type de règle se pose sur le FormGroup parent, car lui seul "voit" les
// deux champs à la fois.
//
// Un validateur est une fonction (ValidatorFn) qui reçoit le contrôle et
// renvoie :
//   - null                          → tout va bien
//   - un objet ValidationErrors     → il y a une erreur (clé = nom de l'erreur)
// ─────────────────────────────────────────────────────────────────────────────

export function champsDifferentsValidator(
    champA: string, champB: string) : ValidatorFn {
        return (group: AbstractControl): ValidationErrors | null =>
        {
            const valeurA: string = group.get(champA)?.value;
            const valeurB: string = group.get(champB)?.value;
            // Si l'un des deux champs est vide, on laisse les validateurs 'required'
            // faire leur travail: ce validateur ne signale rien dans ce cas.
            if (!valeurA || !valeurB){
                return null;
            }

            // Comparaison insensible à la casse et aux espaces superflus
            const identiques = 
                valeurA.trim().toLowerCase() === valeurB.trim().toLowerCase();
                
            // On renvoie l'erreur sous la clé 'champsIdentiques' si les valeurs
            // sont égales, sinon null (pas d'erreur).
            return identiques ? {champsIdentiques: true} : null;
        }
    }