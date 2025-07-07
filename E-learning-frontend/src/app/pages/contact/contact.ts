import { Component } from '@angular/core';
import { Header } from '../../component/header/header';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [Header],
  template: `
    <app-header />
    <div class="p-8 max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-6">Contact Us</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 class="text-xl font-semibold mb-4">Get in Touch</h2>
          <p class="text-gray-600 mb-6">
            Have questions about our courses or need support? We're here to help!
          </p>
          <div class="space-y-4">
            <div>
              <h3 class="font-semibold">Email</h3>
              <p class="text-gray-600">support&#64;elearning.com</p>
            </div>
            <div>
              <h3 class="font-semibold">Phone</h3>
              <p class="text-gray-600">+1 (555) 123-4567</p>
            </div>
            <div>
              <h3 class="font-semibold">Address</h3>
              <p class="text-gray-600">123 Learning Street<br>Education City, EC 12345</p>
            </div>
          </div>
        </div>
        <div>
          <h2 class="text-xl font-semibold mb-4">Send us a Message</h2>
          <form class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">Name</label>
              <input type="text" class="w-full p-3 border border-gray-300 rounded-md" placeholder="Your name">
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Email</label>
              <input type="email" class="w-full p-3 border border-gray-300 rounded-md" placeholder="your@email.com">
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Message</label>
              <textarea rows="4" class="w-full p-3 border border-gray-300 rounded-md" placeholder="Your message"></textarea>
            </div>
            <button type="submit" class="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class ContactComponent {
} 