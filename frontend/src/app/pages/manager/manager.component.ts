import { Component } from '@angular/core';

@Component({
  selector: 'app-manager',
  template: `
    <div class="page-container">
      <h2>Manager Dashboard</h2>
      <p>This page will display manager-specific functionality and team management.</p>
      <div class="placeholder-content">
        <p>🚧 Under Construction 🚧</p>
        <p>Manager features will be implemented here.</p>
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
export class ManagerComponent {} 