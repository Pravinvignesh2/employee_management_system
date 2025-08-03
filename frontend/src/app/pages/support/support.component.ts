import { Component } from '@angular/core';

@Component({
  selector: 'app-support',
  template: `
    <div class="page-container">
      <h2>IT Support</h2>
      <p>This page will display IT support functionality and ticket management.</p>
      <div class="placeholder-content">
        <p>🚧 Under Construction 🚧</p>
        <p>IT Support features will be implemented here.</p>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 2rem;
    }
    .placeholder-content {
      text-align: center;
      margin-top: 2rem;
      padding: 2rem;
      background: #f8f9fa;
      border-radius: 8px;
    }
  `]
})
export class SupportComponent {} 