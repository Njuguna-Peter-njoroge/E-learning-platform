import { Component } from '@angular/core';
import { Header } from "../../component/header/header";
import { Hero } from "../hero/hero";
import { Success } from "../../component/success/success";

@Component({
  selector: 'app-home',
  imports: [Header, Hero, Success],
  template: `
    <app-header/>
    <app-hero/>

    <app-success/>
  `,
  styles: ``
})
export class HOME {

}
