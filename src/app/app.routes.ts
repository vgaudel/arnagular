import { Routes } from '@angular/router';
import { TextInterpolation } from './components/text-interpolation/text-interpolation';
import { Bindings } from './components/bindings/bindings';
import { ControlFlow } from './components/control-flow/control-flow';
import { ExosBindings } from './components/exos-bindings/exos-bindings';
import { NotFound } from './components/layout/not-found/not-found';
import { Welcome } from './components/layout/welcome/welcome';
import { Signals } from './components/signals/signals';
import { ExosSignals } from './components/exos-signals/exos-signals';
import { ProduitList } from './components/produit-list/produit-list';
import { BureauVoteList } from './components/bureau-vote-list/bureau-vote-list';
import { ExosIO } from './components/exos-io/exos-io';
import { PipesExemples } from './components/pipes-exemples/pipes-exemples';
import { ProduitTable } from './components/produit-table/produit-table';
import { Ex01Compteur } from './components/exos-signals/ex01-compteur/ex01-compteur';
import { Ex02SignalTexte } from './components/exos-signals/ex02-signal-texte/ex02-signal-texte';
import { Ex03Surface } from './components/exos-signals/ex03-surface/ex03-surface';
import { Ex04Toggle } from './components/exos-signals/ex04-toggle/ex04-toggle';
import { Ex05Notes } from './components/exos-signals/ex05-notes/ex05-notes';
import { Ex06Todo } from './components/exos-signals/ex06-todo/ex06-todo';
import { Ex07ComputedChaine } from './components/exos-signals/ex07-computed-chaine/ex07-computed-chaine';
import { Ex08Effect } from './components/exos-signals/ex08-effect/ex08-effect';
import { Ex09Panier } from './components/exos-signals/ex09-panier/ex09-panier';
import { Ex10Filtre } from './components/exos-signals/ex10-filtre/ex10-filtre';
import { preferenceGuard } from './guards/preference-guard';
import { ProduitTableHttp } from './components/produit-table-http/produit-table-http';
import { ProduitAddFormSignal } from './components/produit-add-form-signal/produit-add-form-signal';

export const routes: Routes = [
    { path: 'welcome', component: Welcome},
    { path: '', redirectTo : 'welcome', pathMatch: 'full'},
    { path: 'textinterpolation', component: TextInterpolation, canActivate: [preferenceGuard]},
    { path: 'bindings', component: Bindings},
    { path: 'controlflow', component: ControlFlow},
    { path: 'exosbindings', component: ExosBindings},
    { path: 'signals', component: Signals},
    { path: 'exossignals', 
      component: ExosSignals,
      children: [
        { path : 'ex01-compteur', component: Ex01Compteur},
        { path : 'ex02-signal-texte', component: Ex02SignalTexte},
        { path : 'ex03-surface', component: Ex03Surface},
        { path : 'ex04-toggle', component: Ex04Toggle},
        { path : 'ex05-notes', component: Ex05Notes},
        { path : 'ex06-todo', component: Ex06Todo},
        { path : 'ex07-computed-chaine', component: Ex07ComputedChaine},
        { path : 'ex08-effect', component: Ex08Effect},
        { path : 'ex09-panier', component: Ex09Panier},
        { path : 'ex10-filtre', component: Ex10Filtre},
        { path : '', redirectTo : 'ex01-compteur', pathMatch : 'full'}
      ]},

    { path: 'produits', component: ProduitList},
    { path: 'produitsv2', component: ProduitTable},
    { path: 'produitshttp', component: ProduitTableHttp},
    { path: 'votation', component: BureauVoteList},
    { path: 'exosio', component: ExosIO},
    { path: 'pipes', component: PipesExemples},
    { path: 'signalform', component: ProduitAddFormSignal},
    { path: '**', component: NotFound},
];
 