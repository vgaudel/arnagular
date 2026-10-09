import { AfterContentInit, AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-exos-signals',
  imports: [FormsModule, RouterOutlet],
  templateUrl: './exos-signals.html',
  styleUrl: './exos-signals.scss',
})
export class ExosSignals {
  
  private router = inject(Router);

  composants: string[] = [
    'ex01-compteur',
    'ex02-signal-texte',
    'ex03-surface',
    'ex04-toggle',
    'ex05-notes',
    'ex06-todo',
    'ex07-computed-chaine',
    'ex08-effect',
    'ex09-panier',
    'ex10-filtre'];
  selectedComponent: string = this.composants[0];

  goToExercice(){
    this.router.navigate(['exossignals',this.selectedComponent]);
  }

}
