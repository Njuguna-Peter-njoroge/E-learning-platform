import { Component } from '@angular/core';
import { Header } from '../../component/header/header';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [Header],
  template: `
    <app-header />
    <div class="p-8">
      <h1 class="text-3xl font-bold mb-6">Dashboard</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-xl font-semibold mb-4">My Courses</h2>
          <p class="text-gray-600">View your enrolled courses and progress</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-xl font-semibold mb-4">Recent Activity</h2>
          <p class="text-gray-600">Track your learning progress</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-xl font-semibold mb-4">Achievements</h2>
          <p class="text-gray-600">View your certificates and badges</p>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class DashboardComponent {
} 