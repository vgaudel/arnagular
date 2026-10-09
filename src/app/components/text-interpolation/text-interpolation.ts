import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-text-interpolation',
  styleUrl: './text-interpolation.scss',
  templateUrl: './text-interpolation.html',
})
export class TextInterpolation {

  message: string = "Bonjour Arnaud, bienvenu sur Arnagular, ton application de formation."
  user = {name: "Baguette", first: "John", age: 40};
}
   