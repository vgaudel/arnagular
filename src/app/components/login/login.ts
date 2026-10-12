import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth-service';

@Component({
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  selector: 'app-login',
  styleUrl: './login.scss',
  templateUrl: './login.html',
})
export class Login {

  protected auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  protected errorMessage = signal('');
  // Vrai pendant l'appel réseau : désactive le bouton (évite le double clic).
  protected loading = signal(false);

  form = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    this.errorMessage.set('');
    this.loading.set(true);

    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => {
        this.loading.set(false);
        // Le guard nous a envoyés ici avec ?retour=/page-demandée : on y retourne.
        // On n'accepte qu'un chemin interne (commençant par un seul "/").
        const retour = this.route.snapshot.queryParamMap.get('retour');
        const safe = retour && retour.startsWith('/') && !retour.startsWith('//');
        this.router.navigateByUrl(safe ? retour : '/welcome');
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(
          err.status === 401
            ? 'Identifiants invalides.'
            : 'Le serveur est injoignable. Réessayez plus tard.'
        );
      },
    });
  }

  logout(): void {
    this.auth.logout();
  }
}
