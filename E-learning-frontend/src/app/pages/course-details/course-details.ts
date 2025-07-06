import { Component, OnInit } from '@angular/core';
import { Header } from "../../component/header/header";
import { ReviewComponentComponent } from "../review-component/review-component";
import { ModuleComponent } from "../module/module";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-course-details',
  imports: [Header, ReviewComponentComponent, ModuleComponent],
  template: `
    <app-header/>
    <div class="relative h-[600px]">
      <div
        class="absolute inset-0 bg-center bg-cover brightness-50 z-0 h-[600px]"
        style="background-image: url('assets/images/maroon students.jpg')"
      ></div>
    </div>  
       <div class="grid grid-cols-[700px,500px] gap-20 px-20 ">
       <!-- <div>
          <h1 class="bg-gray-500 flex justify-center border rounded-xl text-xl font-bold mt-10">Ratings And Reviews</h1>
          <div class="mt-10 bg-gray-300 h-[400px] rounded-xl">
           <div class="grid grid-cols-[200px,350px] gap-4">
            <div class="boarder bg-white rounded-xl  m-4">
              <h1 class="flex justify-center">4 of 5</h1>
              <h1 class="mt-20 flex justify-center">Top Rating</h1>
            </div>
            <div>
              <label for="5">5 stars</label>
              <input type="range" name="" id=""> <br>
              <label for="4">4 stars</label>
              <input type="range" name="" id=""><br>
              <label for="3">3 stars</label>
              <input type="range" name="" id=""><br>
              <label for="2">2 stars</label>
              <input type="range" name="" id=""><br>
              <label for="1">1 stars</label>
              <input type="range" name="" id="">
            </div>
            </div>
          </div>
        </div> -->
        <div>
          <app-review-component/>
        </div>
        <!-- <div class=" mt-[-320px] z-10 bg-white  rounded-xl w-[500px]">
          <div class="p-10">
          <img src="assets/images/maroon students.jpg" alt="" class="">
          <span class="flex justify-center">price</span>
          <h1 class="flex justify-center font-bold mt-10">11 hours left at this price</h1>
          <div class="flex justify-center mb-10">
            <button class="bg-orange-600 p-2 pl-20 pr-20 mt-10 border rounded-xl ">Start Now</button>
          </div>
          <hr>
          <div class="mt-10 ">
            <h1 class="text-xl font-bold">This Course Module</h1>
            <ol>
              <li>inroduction to........</li>
            </ol>
          </div>
          <hr>
          <div>
            <h1 class="text-xl font-bold">This course instructor</h1>
            <p>...........................</p>
          </div>
          <hr>
          <div>
             <h1 class="text-xl font-bold">Share this course</h1>
             
          </div>
          </div>  
        </div> -->
        <div>
          <app-module-component />
        </div>
      </div>
  `,
  styles: ``
})
export class CourseDetails implements OnInit {
  courseId: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id') || '';
    console.log('Course ID from route:', this.courseId);
  }
}
