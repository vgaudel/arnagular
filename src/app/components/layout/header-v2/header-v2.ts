import { Component, inject, input } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { PreferenceService } from '../../../services/preference-service';
import { MatToolbar } from '@angular/material/toolbar';
import { TitleCasePipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatButton, MatIconButton } from '@angular/material/button';

interface NavLink {
  label: string;
  path: string;
}

@Component({
  imports: [MatToolbar, TitleCasePipe, RouterLink, RouterLinkActive, MatIcon, MatMenu, MatMenuItem, MatMenuTrigger, MatIconButton, MatButton],
  selector: 'app-header-v2',
  styleUrl: './header-v2.scss',
  templateUrl: './header-v2.html',
})
export class HeaderV2 {

  private router = inject(Router);
  private preferenceService = inject(PreferenceService);

    titleHeader = input.required<string>();

  navLinks: NavLink[] = [
    { label: "Text-Interpolation", path: "/textinterpolation" },
    { path: "F/bindings", label: 'Bindings' },
    { path: "/controlflow", label: 'Control-Flow' },
    { path: "/exosbindings", label: 'ExosBindings' },
    { path: "/signals", label: 'Signals' },
    { path: "/exossignals", label: 'ExosSignals' },
    { path: "/produits", label: 'Input' },
    { path: "/produitsv2", label: 'Material' },
    { path: "/votation", label: 'Output' },
    { path: "/exosio", label: 'ExosIO' },
    { path: "/pipes", label: 'Pipes' },
    { path: "/produitshttp", label: 'ProduitsHttp' },
    { path: "/signalform", label: 'SignalForm' }
  ];

  goToWelcome() {
    this.router.navigate(['welcome']);
  }
}
