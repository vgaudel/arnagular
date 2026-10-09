import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/layout/header/header';
import { Footer } from './components/layout/footer/footer';
import { HeaderV2 } from './components/layout/header-v2/header-v2';

@Component({
  imports: [RouterOutlet,
    Header,
    Footer, HeaderV2],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('arnagular');
}
  