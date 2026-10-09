import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  selector: 'app-bindings',
  styleUrl: './bindings.scss',
  templateUrl: './bindings.html',
})
export class Bindings {

  //text-interpolation
  title: string = "Démonstration des bindings Angular";
  user = { firstname: "Ada", lastname: "Lovelace" };
  //binding de propriété
  imageUrl: string = "/beard.svg";
  isButtonDisabled: boolean = true;
  //binding d'attribut
  colspanValue: number = 2;
  //class binding
  isActive: boolean = true;
  //style binding
  textColor: string = 'crimson';
  fontSize: number = 18;
  //event binding
  clickCount: number = 0;
  //two-way binding
  userName: string = "";

  incrementCounter(): void{
    this.clickCount++;
  }
  toggleButton(): void{
    this.isButtonDisabled = !this.isButtonDisabled;
  }
}
