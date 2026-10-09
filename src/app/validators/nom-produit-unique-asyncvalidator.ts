import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { ProductService } from '../services/product-service';
import { catchError, map, Observable, of, switchMap, timer } from 'rxjs';

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATEUR ASYNCHRONE (async validator)
// ─────────────────────────────────────────────────────────────────────────────
// Un validateur "classique" (synchrone) répond immédiatement. Mais parfois, la
// réponse dépend du SERVEUR : "ce nom de produit est-il déjà pris ?". On ne peut
// pas répondre instantanément → on utilise un validateur ASYNCHRONE.
//
// Un AsyncValidatorFn renvoie une Promise (ou un Observable) qui se résout par :
//   - null                       → tout va bien (le nom est libre)
//   - un objet ValidationErrors  → erreur (ici la clé 'nomDejaPris')
//
// Pendant l'attente, Angular met le contrôle dans l'état `pending` (utile pour
// afficher un petit "Vérification en cours...").
//
// Ici on renvoie directement l'Observable issu du service : Angular s'abonne et
// se désabonne tout seul, et annule automatiquement la requête précédente si
// l'utilisateur continue de taper.
// ─────────────────────────────────────────────────────────────────────────────

export function nomProduitUniqueAsyncValidator(
    productService: ProductService
): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {

        const nom = (control.value ?? '').trim();

        // Champ vide: on ne teste rien, on laisse le validateur 'required' gérer
        if (!nom) {
            return of(null);
        }

        // timer = debounce : si l'utilisateur retape, Angular annule l'attente précédente
        return timer(400).pipe(
            switchMap(() => productService.productExists$(nom)),
            map((existeDeja) => (existeDeja ? { nomDejaPris: true } : null)),
            // en cas d'erreur réseau, on ne bloque pas le formulaire
            catchError(() => of(null))
        );
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// VARIANTE : version basée sur une Promise + setTimeout
// ─────────────────────────────────────────────────────────────────────────────
// Même comportement, mais écrite "à la main" : on s'abonne dans une Promise et
// on résout nous-mêmes. Le `setTimeout` simule la latence réseau pour bien voir
// l'état `pending`. Plus verbeux que la version Observable (il faut gérer
// l'erreur et le désabonnement soi-même), gardée ici à titre pédagogique.
// ─────────────────────────────────────────────────────────────────────────────

export function nomProduitUniqueAsyncValidatorPromise(
    productService: ProductService
): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> => {

        const nom = (control.value ?? '').trim();

        // Champ vide: on ne teste rien, on laisse le validateur 'required' gérer
        if (!nom) {
            return Promise.resolve(null);
        }

        return new Promise((resolve) => {
            setTimeout(() => {
                const sub = productService.productExists$(nom).subscribe({
                    next: (data) => resolve(data ? { nomDejaPris: true } : null),
                    // en cas d'erreur réseau, on ne bloque pas le formulaire
                    error: () => resolve(null),
                    complete: () => sub.unsubscribe()
                });
            }, 2500);
        });
    };
}
