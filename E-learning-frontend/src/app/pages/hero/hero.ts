import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hero',
  imports: [RouterModule],
  template: `
     <div class=" bg-gradient-to-r from-orange-50 to-green-100  h-[400px] opacity-80   flex justify-center mt-10">
      <div class="grid grid-cols-[600px,600px]   h-[400px]  ">

        <div class="pt-20">
          <div class="absolute z-0  ">
          <img src="assets/images/wave.png" alt="hero girl" height="400px" class=" h-[390px] w-[600px] opacity-40">

          </div>
          <h1 class="text-7xl font-bold z-50">Build Skills With <br> Online Courses</h1>
          <p class="mt-10 font-bold z-20">We denounce with righteous indignation and dislike men who are <br> so beguiled and demoralized that cannot trouble.</p>
          <button class="bg-orange-400 border rounded-xl mt-10 p-2 z-20" routerLink="/register">Join Now</button>
        </div>
        <div class=" h-[400px] ml-[00px] flex justify-center">
          <img src="assets/images/hero-girl_image-removebg-preview.png" alt="hero girl" height="400px" class=" h-[400px] z-20">
          <div class="absolute z-0 mt-20">
             <h1 class="text-7xl text-white skew-y-12 opacity-85 ">SkiBoost Online <br> Learning Platform</h1>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class Hero {

}
