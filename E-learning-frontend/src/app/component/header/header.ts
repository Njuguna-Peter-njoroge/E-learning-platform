import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  template: `
    <div class="flex  justify-between">
      <div class=" ml-20">
        <h1 class="pt-5 font-bold text-xl">SB</h1>
      </div>
      <div class="flex justify-around  mr-[300px] text-black-800 ">
        <button class="p-5" routerLink="/home">Home</button>
        <button class="p-5" routerLink="/courses">Courses</button>
        <button class="p-5" routerLink="">DashBoard </button>
        <button class="p-5" routerLink="">Contact Us</button>
        <button class="p-5" routerLink="">About Us</button>
        <button class="pl-20 p-5" routerLink="/login">Login</button>
      </div>
      
    </div>
  `,
  styles: ``
})
export class Header {

}
