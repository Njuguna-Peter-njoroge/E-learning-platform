import { Component } from '@angular/core';
import { Header } from '../../component/header/header';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [Header],
  template: `
    <app-header />
    <div class="p-8 max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-6">About Us</h1>
      <div class="space-y-8">
        <div>
          <h2 class="text-2xl font-semibold mb-4">Our Mission</h2>
          <p class="text-gray-600 leading-relaxed">
            We are dedicated to making quality education accessible to everyone. Our platform connects learners 
            with expert instructors and provides a comprehensive learning experience that adapts to individual needs.
          </p>
        </div>
        
        <div>
          <h2 class="text-2xl font-semibold mb-4">What We Offer</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white p-6 rounded-lg shadow-md">
              <h3 class="text-xl font-semibold mb-3">Diverse Course Catalog</h3>
              <p class="text-gray-600">
                From programming to design, business to arts, we offer courses across various disciplines 
                to help you achieve your learning goals.
              </p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md">
              <h3 class="text-xl font-semibold mb-3">Expert Instructors</h3>
              <p class="text-gray-600">
                Learn from industry professionals and experienced educators who are passionate about 
                sharing their knowledge and expertise.
              </p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md">
              <h3 class="text-xl font-semibold mb-3">Flexible Learning</h3>
              <p class="text-gray-600">
                Study at your own pace with 24/7 access to course materials, interactive content, 
                and progress tracking.
              </p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md">
              <h3 class="text-xl font-semibold mb-3">Community Support</h3>
              <p class="text-gray-600">
                Connect with fellow learners, participate in discussions, and get support from 
                our vibrant learning community.
              </p>
            </div>
          </div>
        </div>
        
        <div>
          <h2 class="text-2xl font-semibold mb-4">Our Story</h2>
          <p class="text-gray-600 leading-relaxed">
            Founded in 2024, our e-learning platform was born from the belief that education should be 
            accessible, engaging, and effective. We've helped thousands of learners achieve their goals 
            and continue to innovate in online education.
          </p>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class AboutComponent {
} 