import { Component } from '@angular/core';

@Component({
  selector: 'app-hero',
  imports: [],
  template: `
     <div class=" bg-orange-50  h-[400px]   flex justify-center mt-10"> 
      <div class="grid grid-cols-[600px,600px]   h-[400px]  ">

        <div class="pt-20">
          <h1 class="text-2xl font-bold">Build Skills With <br> Online Courses</h1>
          <p class="mt-10">We denounce with righteous indignation and dislike men who are <br> so beguiled and demoralized that cannot trouble.</p>
          <button class="bg-orange-600 border rounded-xl mt-10 p-2">Join Now</button>
        </div>
        <div class=" h-[400px] ml-[00px] flex justify-center">
          <img src="assets/images/hero-girl_image-removebg-preview.png" alt="hero girl" height="400px" class=" h-[400px]">
        </div>
      </div>
    </div> 
  `,
  styles: ``
})
export class Hero {

}
