import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./component/header/header";
import { HOME } from "./pages/home/home";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,  HOME],
  template: `
  <app-home/>
     
     <router-outlet>
  `,
  styles: ``
})
export class App {
  protected title = 'E-learning-frontend';
}
