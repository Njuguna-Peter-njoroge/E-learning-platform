import { Component } from '@angular/core';

@Component({
  selector: 'app-success',
  imports: [],
  template: `
    <div class="mt-20">
      <div class="text-center">
        <h1 class="text-4xl font-bold">Our Success </h1>
        <p class="mt-20">We have been able to create highly trained and professional technicians, <br> programmers ,soft ware engineers and also economics .some working in big companies with huge reputations kike amazone, safaricom</p>
      </div>
      <div class="flex justify-evenly mt-20">
        <span class="text-center ">
          <h1 class="text-4xl text-cyan-600">15K+</h1>
          <p>Students</p>
        </span>
        <span class="text-center">
          <h1 class="text-4xl text-cyan-600">75%</h1>
          <p>Total Success</p>
        </span>
        <span class="text-center">
          <h1 class="text-4xl text-cyan-600">35</h1>
          <p>Main Questions</p>
        </span>
        <span class="text-center">
          <h1 class="text-4xl text-cyan-600">26</h1>
          <p>Chief Experts</p>
        </span>
        <span class="text-center">
          <h1 class="text-4xl text-cyan-600">10</h1>
          <p>Years Of Experience </p>
        </span>
      </div>
    </div>

    <div class="mt-10">
      <div class="text-center ">
        <h1 class="text-blue-600 font-bold text-2xl">All-In-One<h1 class="text-cyan-500">Cloud Software</h1></h1>
        <p>SkiBoost is one powerful online software suite that combines all the tools needed to run a successful school or office.</p>
      </div>
      <div class="flex justify-evenly mt-[150px] ">
        <div class="w-[250px] border shadow-2xl rounded-xl text-center">
          <div class="flex justify-center">
           <img src="assets/images/4038766.jpg" alt="paper" class="border rounded-full h-[50px] mt-[-20px] flex justify-center">
           </div>
           <h1 class="font-bold mt-10 ">Online Billing, Invoicing, & Contracts</h1>
           <p>Simple and secure control of your organization’s financial and legal transactions. Send customized invoices and contracts</p>
        </div>
        <div class="w-[250px] border shadow-2xl rounded-xl text-center h-[300px]">
          <div class="flex justify-center">
           <img src="assets/images/book.jpg" alt="paper" class="border rounded-full h-[50px] mt-[-20px] flex justify-center">
           </div>
           <h1 class="font-bold mt-10 ">Easy Scheduling & Attendance Tracking</h1>
           <p>Schedule and reserve classrooms at one campus or multiple campuses. Keep detailed records of student attendance</p>
        </div>
        <div class="w-[250px] border shadow-2xl rounded-xl text-center">
          <div class="flex justify-center">
           <img src="assets/images/4038766.jpg" alt="paper" class="border rounded-full h-[50px] mt-[-20px] flex justify-center bg-blue-600">
           </div>
           <h1 class="font-bold mt-10 ">Customer Tracking</h1>
           <p>Automate and track emails to individuals or groups. Skilline’s built-in system helps organize your organization </p>
        </div>
      </div>
    </div>
    <div>
      <div class="text-center mt-20">
        <h1 class="text-3xl font-bold mb-10">What is SkiBoost?</h1>
        <p>SkiBoost is a platform that allows educators to create online classes whereby they can <br> store the course materials online; manage assignments, quizzes and exams; monitor <br> due dates; grade results and provide students with feedback all in one place.</p>
      </div>
      <div class=" bg-aliceblue-100  h-[400px]   flex justify-center mt-10">
      <div class="grid grid-cols-[600px,600px] gap-4 mt-20">
        <div class="mt-20">
          <h1 class="text-2xl font-bold">Everything you can do in a physical <br>classroom, <h1 class="text-cyan-400">you can do with SkiBoost</h1></h1>
          <p class="mb-10">SkiBoost’s school management software helps traditional and online schools manage scheduling, attendance, payments and virtual classrooms all in one secure cloud-based system.</p>
          <a href="https://www.freecodecamp.org/news/" >Learn More</a>
        </div>
        <div>
          <img src="assets/images/classroom.jpg" alt=" classroom" class="border-4 border-t-cyan-400 rounded-xl">
        </div>
      </div>
    </div>
    <div class="bg-cyan-100 mt-10">
      <h1 class="text-2xl font-bold">Explore Courses</h1>
      <ul class="mt-4">
        <li>Accounting</li>
        <li>programming</li>
        <li>Economics</li>
        <li>Product Management</li>
        <li>Medicine</li>
      </ul>
      <button>See More</button>
    </div>
  `,
  styles: ``
})
export class Success {

}
